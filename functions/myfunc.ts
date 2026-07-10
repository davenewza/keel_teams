import { InlineFile, Myfunc, notify, Team, models } from '@teamkeel/sdk';

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(items: T[], count: number): T[] {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, items.length));
}

function generateOrderNumber(): string {
    return `ORD-${Date.now()}-${randomInt(1000, 9999)}`;
}

async function ensureProducts() {
    const products = await models.product.findMany({ limit: 100 });
    if (products.length > 0) {
        return products;
    }

    const seedProducts = [
        { sku: 'SKU-A100', title: 'Widget', price: 29.99 },
        { sku: 'SKU-B200', title: 'Gadget', price: 49.5 },
        { sku: 'SKU-C300', title: 'Gizmo', price: 19.95 },
    ];

    return Promise.all(
        seedProducts.map((product) => models.product.create(product))
    );
}

function buildOrderDocument(
    orderNumber: string,
    items: Array<{ sku: string; title: string; quantity: number; price: number }>
) {
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const lines = [
        'Order Document',
        '================',
        `Order Number: ${orderNumber}`,
        `Generated At: ${new Date().toISOString()}`,
        '',
        'Items:',
        ...items.map(
            (item, index) =>
                `  ${index + 1}. ${item.title} (${item.sku}) - Qty: ${item.quantity} @ $${item.price.toFixed(2)}`
        ),
        '',
        `Total: $${total.toFixed(2)}`,
    ];

    const document = new InlineFile({
        filename: `${orderNumber}.txt`,
        contentType: 'text/plain',
    });
    document.write(Buffer.from(lines.join('\n'), 'utf8'));
    return document;
}

export default Myfunc(async (ctx, inputs) => {
    const products = await ensureProducts();
    const selectedProducts = pickRandom(products, randomInt(1, 3));
    const orderNumber = generateOrderNumber();

    const items = selectedProducts.map((product) => ({
        product: { id: product.id },
        quantity: randomInt(1, 5),
        price: product.price,
    }));

    const document = buildOrderDocument(
        orderNumber,
        selectedProducts.map((product, index) => ({
            sku: product.sku,
            title: product.title,
            quantity: items[index].quantity,
            price: items[index].price,
        }))
    );

    const order = await models.order.create({
        orderNumber,
        processedById: ctx.identity!.userId!,
        document,
        items,
    });

    await notify.email({
        recipients: {
            to: {
                teams: [Team.Accounts],
                emails: 'sanodn@gmail.com',
                identities: ctx.identity,
            },
        },
        subject: `New order ${orderNumber}`,
        content: {
            body: `Order ${orderNumber} was created with total $${order.total.toFixed(2)}.`,
            actions: [
                { label: 'Go to Keel', url: 'https://keel.so' },
                { label: 'View docs', url: 'https://keel.so/docs' },
            ],
        },
        attachments: [order.document!, InlineFile.fromDataURL(await order.document!.toDataURL())],
    });

    return {};
});
