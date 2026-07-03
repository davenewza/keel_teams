
import { Myfunc, notify, Team } from '@teamkeel/sdk';

export default Myfunc(async (ctx, inputs) => {

    await notify.email({
        recipients: {
            to: {
                teams: [Team.Accounts],
                emails: "sanodn@gmail.com",
                identities: ctx.identity
            },
        },
        subject: "You have mail!",
        content: {
            body: "Hello world", actions: [
                { label: "Go to Keel", url: "https://keel.so" },
                { label: "View docs", url: "https://keel.so/docs" }
            ]
        }
    });

    return {};
});