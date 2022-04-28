import { ValidationPipeOptions } from '@nestjs/common';
import { ParamsOptions } from '@nestjsx/crud-request';
import { ClassTransformOptions } from 'class-transformer';

export const CRUD_MODULE_OPTIONS_TOKEN = 'CRUD_MODULE_OPTIONS_TOKEN';

export const CRUD_MODULE_SETTINGS_TOKEN = 'CRUD_MODULE_SETTINGS_TOKEN';

export const CRUD_MODULE_DEFAULT_SETTINGS_TOKEN =
  'CRUD_MODULE_DEFAULT_SETTINGS_TOKEN';

export const CRUD_MODULE_CRUD_REQUEST_KEY = 'CRUD_MODULE_CRUD_REQUEST_KEY';

export const CRUD_MODULE_ROUTE_MODEL_METADATA =
  'CRUD_MODULE_ROUTE_MODEL_METADATA';

export const CRUD_MODULE_ROUTE_VALIDATION_METADATA =
  'CRUD_MODULE_ROUTE_VALIDATION_METADATA';

export const CRUD_MODULE_ROUTE_SERIALIZATION_METADATA =
  'CRUD_MODULE_ROUTE_SERIALIZATION_METADATA';

export const CRUD_MODULE_ROUTE_ACTION_METADATA =
  'CRUD_MODULE_ROUTE_ACTION_METADATA';

export const CRUD_MODULE_ROUTE_PARAMS_METADATA =
  'CRUD_MODULE_ROUTE_PARAMS_METADATA';

export const CRUD_MODULE_ROUTE_QUERY_ALLOW_METADATA =
  'CRUD_MODULE_ROUTE_QUERY_ALLOW_METADATA';

export const CRUD_MODULE_ROUTE_QUERY_EXCLUDE_METADATA =
  'CRUD_MODULE_ROUTE_QUERY_EXCLUDE_METADATA';

export const CRUD_MODULE_ROUTE_QUERY_PERSIST_METADATA =
  'CRUD_MODULE_ROUTE_QUERY_PERSIST_METADATA';

export const CRUD_MODULE_ROUTE_QUERY_FILTER_METADATA =
  'CRUD_MODULE_ROUTE_QUERY_FILTER_METADATA';

export const CRUD_MODULE_ROUTE_QUERY_JOIN_METADATA =
  'CRUD_MODULE_ROUTE_QUERY_JOIN_METADATA';

export const CRUD_MODULE_ROUTE_QUERY_SORT_METADATA =
  'CRUD_MODULE_ROUTE_QUERY_SORT_METADATA';

export const CRUD_MODULE_ROUTE_QUERY_LIMIT_METADATA =
  'CRUD_MODULE_ROUTE_QUERY_LIMIT_METADATA';

export const CRUD_MODULE_ROUTE_QUERY_MAX_LIMIT_METADATA =
  'CRUD_MODULE_ROUTE_QUERY_MAX_LIMIT_METADATA';

export const CRUD_MODULE_ROUTE_QUERY_CACHE_METADATA =
  'CRUD_MODULE_ROUTE_QUERY_CACHE_METADATA';

export const CRUD_MODULE_ROUTE_QUERY_ALWAYS_PAGINATE_METADATA =
  'CRUD_MODULE_ROUTE_QUERY_ALWAYS_PAGINATE_METADATA';

export const CRUD_MODULE_ROUTE_QUERY_SOFT_DELETE_METADATA =
  'CRUD_MODULE_ROUTE_QUERY_SOFT_DELETE_METADATA';

export const CRUD_MODULE_ROUTE_CREATE_ONE_METADATA =
  'CRUD_MODULE_ROUTE_CREATE_ONE_METADATA';

export const CRUD_MODULE_ROUTE_UPDATE_ONE_METADATA =
  'CRUD_MODULE_ROUTE_UPDATE_ONE_METADATA';

export const CRUD_MODULE_ROUTE_DELETE_ONE_METADATA =
  'CRUD_MODULE_ROUTE_DELETE_ONE_METADATA';

export const CRUD_MODULE_ROUTE_REPLACE_ONE_METADATA =
  'CRUD_MODULE_ROUTE_REPLACE_ONE_METADATA';

export const CRUD_MODULE_ROUTE_RECOVER_ONE_METADATA =
  'CRUD_MODULE_ROUTE_RECOVER_ONE_METADATA';

export const CRUD_MODULE_ROUTE_ID_DEFAULT_PATH = ':id';

export const CRUD_MODULE_ROUTE_CREATE_MANY_DEFAULT_PATH = '/bulk';

export const CRUD_MODULE_ROUTE_RECOVER_ONE_DEFAULT_PATH =
  '/recover/' + CRUD_MODULE_ROUTE_ID_DEFAULT_PATH;

export const CRUD_MODULE_PARAM_BODY_METADATA =
  'CRUD_MODULE_PARAM_BODY_METADATA';

export const CRUD_MODULE_API_QUERY_METADATA = 'CRUD_MODULE_API_QUERY_METADATA';

export const CRUD_MODULE_API_PARAMS_METADATA =
  'CRUD_MODULE_API_PARAMS_METADATA';

export const CRUD_MODULE_API_RESPONSE_METADATA =
  'CRUD_MODULE_API_RESPONSE_METADATA';

export const CRUD_MODULE_DEFAULT_PARAMS_OPTIONS: ParamsOptions = {
  id: { field: 'id', type: 'string', primary: true },
};

export const CRUD_MODULE_DEFAULT_TRANSFORM_OPTIONS: ClassTransformOptions = {
  strategy: 'excludeAll',
  excludeExtraneousValues: true,
  excludePrefixes: ['_', '__'],
};

export const CRUD_MODULE_DEFAULT_VALIDATION_PIPE_OPTIONS: ValidationPipeOptions =
  {
    transform: true,
    transformOptions: CRUD_MODULE_DEFAULT_TRANSFORM_OPTIONS,
  };