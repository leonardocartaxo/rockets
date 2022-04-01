import { SetMetadata, Type } from '@nestjs/common';
import { ApiParamOptions } from '@nestjs/swagger';
import { CRUD_MODULE_API_PARAMS_METADATA } from '../../crud.constants';
import { CrudApiParamMetadataInterface } from '../../interfaces/crud-api-param-metadata.interface';
import { CrudReflectionService } from '../../services/crud-reflection.service';

/**
 * @CrudApiParam() open api decorator
 */
export function CrudApiParam(options?: ApiParamOptions): MethodDecorator {
  return (target: Type, propertyKey: string | symbol) => {
    const reflectionService = new CrudReflectionService();

    const previousValues = reflectionService.getApiParamsOptions(target) || [];

    const value: CrudApiParamMetadataInterface = {
      propertyKey,
      options,
    };

    const values = [...previousValues, value];

    SetMetadata(CRUD_MODULE_API_PARAMS_METADATA, values)(target);
  };
}