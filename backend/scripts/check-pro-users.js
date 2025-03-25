// Jalankan di MongoDB Shell atau save sebagai script

db.users.find({ isPro: true }).forEach(user => {
    print(`User ID: ${user.clerkId}`);
    print(`Pro Status: ${user.isPro}`);
    print(`Stripe Customer ID: ${user.stripeCustomerId}`);
    print(`Last Updated: ${user.updatedAt}`);
    print('------------------------');
});

// Periksa juga jika ada inconsistensi
db.users.find({
    $or: [
        { isPro: { $exists: false } },
        { stripeCustomerId: { $exists: true }, isPro: false }
    ]
}).forEach(user => {
    print(`Potential Issue - User ID: ${user.clerkId}`);
    print(`Current State: ${JSON.stringify(user, null, 2)}`);
    print('------------------------');
});
