const core = require("@aws-cdk/core");
const apigateway = require("@aws-cdk/aws-apigateway");
const lambda = require("@aws-cdk/aws-lambda");
const s3 = require("@aws-cdk/aws-s3");

class WidgetService extends core.Construct {
  constructor(scope, id) {
    super(scope, id);

    const myBucket = s3.Bucket.fromBucketName(this, "my-demo-pipeline-bucket", "demo-pipe-s3")
    

    const handler = new lambda.Function(this, "WidgetHandler", {
      runtime: lambda.Runtime.GO_1_X, 
      code: lambda.Code.fromBucket(myBucket, "function.zip", undefined),
      handler: "pipeline",
    });

    myBucket.grantReadWrite(handler); // was: handler.role);

    const api = new apigateway.RestApi(this, "widgets-api", {
      restApiName: "Widget Service",
      description: "This service serves widgets."
    });

    const getWidgetsIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("GET", getWidgetsIntegration); // GET /
  }
}

module.exports = { WidgetService }