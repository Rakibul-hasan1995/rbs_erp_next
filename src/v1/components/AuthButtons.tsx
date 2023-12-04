// // components/AuthButtons.js
// 'use client'
// import { signIn, signOut, useSession } from 'next-auth/react';

// function AuthButtons() {
//    const { data: session } = useSession();

//    if (session) {
//       // User is signed in
//       return (
//          <div>
//             <p>Welcome, {session.user.name}!</p>
//             <button onClick={() => signOut()}>Sign out</button>
//          </div>
//       );
//    }

//    // User is not signed in
//    return (
//       <div>
//          <form
//             onSubmit={(e) => {
//                e.preventDefault();
//                const username = e.target.username.value;
//                const password = e.target.password.value;
//                signIn('credentials', { username, password });
//             }}
//          >
//             <label>
//                Username:
//                <input type="text" name="username" required />
//             </label>
//             <label>
//                Password:
//                <input type="password" name="password" required />
//             </label>
//             <button type="submit">Sign in</button>
//          </form>
//       </div>
//    );
// }

// export default AuthButtons;
