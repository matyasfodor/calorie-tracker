import { GraphQLSchema } from 'graphql/type/schema'
import { getDirective, mapSchema, MapperKind } from '@graphql-tools/utils'
import { defaultFieldResolver } from 'graphql/execution/execute'
import { AuthenticationError } from 'apollo-server-errors'
import isNil from 'lodash.isnil'
import { ContextType } from '../context'

// Inspired from https://www.graphql-tools.com/docs/schema-directives#enforcing-access-permissions

function getAuthDirective (directiveName: string): { authDirectiveTypeDefs: string, authDirectiveTransformer: (schema: GraphQLSchema) => GraphQLSchema } {
  const typeDirectiveArgumentMaps: Record<string, any> = {}
  return {
    authDirectiveTypeDefs: `directive @${directiveName}(
      requires: Role = ADMIN,
    ) on OBJECT | FIELD_DEFINITION

    enum Role {
      ADMIN
      REVIEWER
      USER
      UNKNOWN
    }`,
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: type => {
          const authDirective = getDirective(schema, type, directiveName)?.[0]
          if (authDirective != null) {
            typeDirectiveArgumentMaps[type.name] = authDirective
          }
          return undefined
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const authDirective: {requires?: string} | null =
            getDirective(schema, fieldConfig, directiveName)?.[0] ?? typeDirectiveArgumentMaps[typeName]

          if (authDirective != null) {
            const { requires } = authDirective
            if (!isNil(requires)) {
              const { resolve = defaultFieldResolver } = fieldConfig

              fieldConfig.resolve = function (source, args, context: ContextType, info) {
                if (requires !== 'UNKNOWN' && context?.user === null) {
                  throw new AuthenticationError(`User should be authenticated to access field ${fieldConfig.astNode?.name.value ?? ''}`)
                } else if (requires === 'ADMIN' && (context?.isAdmin ?? false)) {
                  throw new AuthenticationError(`User is not authorized to access field ${fieldConfig.astNode?.name.value ?? ''}`)
                }

                return resolve(source, args, context, info)
              }
              return fieldConfig
            }
          }
        }
      })
  }
}

export const authDirective = getAuthDirective('auth')
