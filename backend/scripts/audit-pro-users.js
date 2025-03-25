db.users.find({
    $or: [
        { isPro: true },
        { stripeSubscriptionId: { $exists: true } }
    ]
}).forEach(user => {
    print(`Audit - ${user.fullName}`);
    print(`Pro: ${user.isPro}`);
    print(`Subscription ID: ${user.stripeSubscriptionId}`);
    print(`Last Updated: ${user.updatedAt}`);
    print('------------------------');
});
