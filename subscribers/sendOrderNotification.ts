import { OrderStatus, SendOrderNotification, notify } from '@teamkeel/sdk';

// To learn more about events and subscribers, visit https://docs.keel.so/events
export default SendOrderNotification(async (ctx, event) => {

    if (event.target.data.status == OrderStatus.Dispatched || event.target.data.status == OrderStatus.Picked) {
        await notify.email({
            recipients: {
                to: { emails: ["sanodn@gmail.com", "dave.new@keel.xyz"] },
                cc: { emails: ["dave@tradeworks.co.za"] }
            },
            content: "Your order " + event.target.data.orderNumber + " is  " + event.target.data.status,
            subject: "Your order " + event.target.data.orderNumber
        });
    }
});