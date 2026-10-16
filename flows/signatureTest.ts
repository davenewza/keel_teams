import { SignatureTest, FlowConfig, InlineFile } from '@teamkeel/sdk';

const config = {
	// See https://docs.keel.so/flows for options
} as const satisfies FlowConfig;

export default SignatureTest(config, async (ctx) => {
	const page1 = await ctx.ui.page("signature input page", {
		content: [
			ctx.ui.inputs.signature("agreement", {
				label: "Sign here",
			}),
		],
	});

	const pngDataURL = await page1.agreement.toPngDataURL();
	const inlineFile = InlineFile.fromDataURL(pngDataURL);

	return {
		agreement: page1.agreement,
		pngDataURL,
		inlineFileContentType: inlineFile.contentType,
	};
});