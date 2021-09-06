const core = require("@aws-cdk/core");
const apigateway = require("@aws-cdk/aws-apigateway");
const lambda = require("@aws-cdk/aws-lambda");
const s3 = require("@aws-cdk/aws-s3");
const iam = require("@aws-cdk/aws-iam");

class WidgetService extends core.Construct {
  constructor(scope, id) {
    super(scope, id);

    const lambdaRole = new iam.Role(this, "pipeline-lambda-role", {
      roleName: "demo-pipeline-lambda-role",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        // basic policie for a lambda func
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
        // to access all the resources from eks cluster
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEKSClusterPolicy"),
        // the lambda role only need to read access
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3ReadOnlyAccess"),
      ],

    })

    // getting the bucket by name 
    const myBucket = s3.Bucket.fromBucketName(this, "my-demo-pipeline-bucket", "demo-pipe-s3")
    
    // creating the lambda template here
    const handler = new lambda.Function(this, "demo-cdk-Handler", {
      runtime: lambda.Runtime.GO_1_X, 
      code: lambda.Code.fromBucket(myBucket, "function.zip", undefined),
      handler: "demo-pipeline-func-cdk",
      role: lambdaRole,
    });

    // creating the api-gateway here to call the lambda
    const api = new apigateway.RestApi(this, "demo-pipeline-api", {
      restApiName: "demo-pipeline-api-cdk",
      description: "This service serves widgets."
    });
    // here we have done the lambda integration
    const getWidgetsIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("GET", getWidgetsIntegration); // GET 
  }
}

module.exports = { WidgetService }