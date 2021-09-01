const cdk = require('@aws-cdk/core');
const widget_service = require('../lib/widget_service');


class MyWidgetServiceStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    new widget_service.WidgetService(this, 'Widgets');
  }
}

module.exports = { MyWidgetServiceStack }
