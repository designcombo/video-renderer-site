const path = require('path');
const lambda = require('@remotion/lambda');
const dotenv = require('dotenv');

dotenv.config();

async function deploy() {
	const {functionName} = await lambda.deployFunction({
		region: process.env.AWS_REGION || "us-east-1",
		timeoutInSeconds: Number(process.env.TIMEOUT || 120),
		memorySizeInMb: 2048,
		createCloudWatchLogGroup: true,
		//enableV5Runtime: true // update
	});
	console.log("LAMBDA_FUNCTION :",functionName)

	const {bucketName} = await lambda.getOrCreateBucket({
		region: process.env.AWS_REGION || "us-east-1",
	});
	console.log("LAMBDA_BUCKET :",bucketName)

	const {serveUrl} = await lambda.deploySite({
		bucketName,
		entryPoint: path.resolve(process.cwd(), 'src/index.ts'),
		region: process.env.AWS_REGION || "us-east-1",
		siteName: process.env.SITE_NAME || 'remotion',
	});
	console.log("SERVER_URL :",serveUrl)
}

deploy();
