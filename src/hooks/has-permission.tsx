

// export type ROLE = keyof typeof ROLES;
// type RESOURCES = keyof typeof Permissions;
// type PERMISSION<Action extends RESOURCES> = (typeof Permissions)[Action][number];


// const Permissions = {
//     comments: ["view", "delete", "update", "create"],
//     tasks: ["view", "delete", "update", "create"],
//     projects: ["view", "delete", "update", "create"],
// } as const;


// const ROLES = {
//     admin: {
//         comments: {
//             view: true,
//             delete: true,
//             update: true,
//             create: true
//         },
//         tasks: {
//             view: true,
//             delete: true,
//             update: true,
//             create: true
//         },
//         projects: {
//             view: true,
//             delete: true,
//             update: true,
//             create: true
//         },
//     },
//     developer: {
//         comments: {
//             view: true,
//             delete: (id: string) => id === comment.id,
//             update: false,
//             create: false
//         },
//         tasks: {
//             view: true,
//             delete: false,
//             update: false,
//             create: false
//         },
//         projects: {
//             view: true,
//             delete: false,
//             update: false,
//             create: false
//         },
//     }
// } as const;

// export function hasPermission(user: { id: string; role: ROLE}, permission: PERMISSION) {
//     return (ROLES[user.role] as readonly PERMISSION[]).includes(permission);
// }
