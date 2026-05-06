const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    if (users.length === 0) {
        console.log("No users found");
        return;
    }
    const user = users[0];
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: user.email
    });
    console.log(data.properties);
}
test();
