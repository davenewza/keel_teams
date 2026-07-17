import { PayAccount, FlowConfig } from '@teamkeel/sdk';

const config = {
	// See https://docs.keel.so/flows for options
} as const satisfies FlowConfig;

export default PayAccount(config, async (ctx, task) => {

});