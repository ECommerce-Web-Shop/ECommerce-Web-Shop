// import { graphqlClient, gql } from '../../../helpers/apollo-client';

// async function handler(req, res) {
//     if (req.method === 'POST') {
//         const {
//             email
//         } = req.body;

//         const client = graphqlClient();

//         const forgotPasswordMutation = gql `
//             mutation forgotPassword($email: String!) {
//                 forgotPassword(input: {
//                     email: $email,
//                 }) {
//                    ok
//                 }
//             }
//         `;

//         try {
//             const result = await client.mutate({
//                 mutation: forgotPasswordMutation,
//                 variables: {
//                     email
//                 }
//             });

//             if (result.data) {
            
//                 return res.json({
//                     message: "Logged in successfully",
//                     ok: true,
//                 });
//             };
//         } catch {
//             return res.json({
//                 message: "Some errors happen while logging. May be wrong username or password",
//                 ok: false,
//             });
//         }
//         // get user from database then:

//     } else {
//         // Handle any other HTTP method
//         return res.json({
//             message: 'This API only works with GET method',
//             ok: false,
//         })
//     }
// }