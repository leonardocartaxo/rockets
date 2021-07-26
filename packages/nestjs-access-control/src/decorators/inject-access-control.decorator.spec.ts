import { ACCESS_CONTROL_OPTIONS_KEY } from '../constants';
import { AccessControlModuleOptions } from '../interfaces/access-control-module-options.interface';
import { InjectAccessControl } from './inject-access-control.decorator';

describe('@InjectAccessControl', () => {
  class Test {
    constructor(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      @InjectAccessControl() accessControl: AccessControlModuleOptions,
    ) {
      return null;
    }
  }

  it('should enhance class with expected constructor access control options metadata', () => {
    const metadata = Reflect.getMetadata('self:paramtypes', Test);
    expect(metadata).toEqual([{ index: 0, param: ACCESS_CONTROL_OPTIONS_KEY }]);
  });
});
