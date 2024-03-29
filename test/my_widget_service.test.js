const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const MyWidgetService = require('../lib/my_widget_service-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new MyWidgetService.MyWidgetServiceStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
