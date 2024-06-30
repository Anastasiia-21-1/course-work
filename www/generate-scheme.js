require('dotenv').config();
const { exec } = require('child_process');

const command = `gq ${process.env.HASURA_PROJECT_ENDPOINT} -H 'X-Hasura-Admin-Secret: ${process.env.HASURA_ADMIN_SECRET}' --introspect > schema.graphql`;

exec(command, (err, stdout, stderr) => {
    if (err) {
        console.error(`Error executing command: ${err}`);
        return;
    }
    console.log(stdout);
});
