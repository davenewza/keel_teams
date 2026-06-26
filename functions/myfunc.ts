import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Myfunc, notify, Team } from '@teamkeel/sdk';

// const templateHtml = readFileSync(
//     join(dirname(fileURLToPath(import.meta.url)), 'mytemplate.html'),
//     'utf-8'
// );

// To learn more about what you can do with custom functions, visit https://docs.keel.so/functions
export default Myfunc(async (ctx, inputs) => {

    // await notify.email({
    //     recipients: { to: { teams: [Team.Accounts] }, cc: { emails: "sanodn@gmail.com" }, bcc: { identities: ctx.identity } },
    //     subject: "Hello world",
    //     content: {
    //         title: "Hello world!",
    //         body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    //         actions: [
    //             { label: "Go", url: "https://keel.so" },
    //             { label: "Somethig else", url: "https://keel.so/help" }
    //         ]
    //     }
    // });


    await notify.email({
        //recipients: { to: { emails: ["dave.new@keel.xyz", "nobody.here@keel.xyz"] } },
        recipients: { to: { teams: [Team.Accounts] }, cc: { emails: "sanodn@gmail.com" }, bcc: { identities: ctx.identity } },
        subject: "Hello world!",
        content: "Hello world!"
    });

    return {};
});