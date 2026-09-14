// import { verify } from "argon2";
// import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../config/constants.js";
// import { sendEmail } from "../lib/nodemailer.js";
import { OAUTH_EXCHANGE_EXPIRY } from "../config/constants.js";
import { getHtmlFromMjmlTemplate } from "../lib/get-html-from-mjml-template.js";
import { github } from "../lib/oauth/github.js";
import { google } from "../lib/oauth/google.js";
import { sendEmail } from "../lib/send-email.js";
import { authenticateUser, clearResetPasswordToken, clearUserSession, clearVerifyEmailTokens, comparePassword, createResetPasswordLink, createUser, createUserWithOauth, findUserByEmail, findUserById, findVerificationEmailToken, getResetPasswordToken, getUserByEmail, getUserWithOauthId, hashPassword,  linkUserWithOauth, sendNewVerifyEmailLink, updateUserByName, updateUserPassword, verifyUserEmailAndUpdate } from "../services/auth.services.js";
import { getAllShortLinks } from "../services/shortener.services.js";
import { forgotPasswordSchema, loginUserSchema, registerUserSchema, setPasswordSchema, verifyEmailSchema, verifyPasswordSchema, verifyResetPasswordSchema, verifyUserSchema } from "../validators/auth-validator.js";
import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";



export const getRegisterPage = (req, res) => {
     if(req.user) return res.redirect("/");
    return res.render("auth/register", {errors: req.flash("errors")});
};

export const getLoginPage = (req, res) => {
     if(req.user) return res.redirect("/");
    return res.render("auth/login", {errors: req.flash("errors")});
};

export const postRegister = async (req, res) =>{
     if(req.user) return res.redirect("/");
    // const {name, email, password} = req.body;

    const {data , error} = registerUserSchema.safeParse(req.body);
    console.log(data);

    if (error){
        const errors = error.issues[0].message;
        req.flash("errors", errors);
        res.redirect("/register");
    }
      const {name, email, password} = data;


    const userExists = await getUserByEmail(email);
    console.log(userExists);

    // if (userExists) return res.redirect("/register");
    if(userExists) {
        req.flash("errors", "User already exists");
        return res.redirect("/register");
    }

    const hashedPassword = await hashPassword(password);

    const [user] = await createUser({name, email, password: hashedPassword});
    console.log(user);

    // res.redirect("/login");
    
    await authenticateUser({req, res, user, name, email});
    
    await sendNewVerifyEmailLink({email, userId: user.id});
    
    res.redirect("/");

}

export const postLogin = async (req, res) => {
    // res.setHeader("Set-Cookie", "isLoggedIn=true; path=/;");
    if(req.user) return res.redirect("/");
    // const {email, password} = req.body;
    const {data , error} = loginUserSchema.safeParse(req.body);
    console.log(data);

    if (error){
        const errors = error.issues[0].message;
        req.flash("errors", errors);
        res.redirect("/login");
    }
      const {email, password} = data;

    const user = await getUserByEmail(email);
    console.log("user: " ,user);

    if(!user){
         req.flash("errors", "Invalid Email or Password");
         return res.redirect("/login");
    }  

    if (!user.password) {
        req.flash(
            "errors",
            "You have created account with social login. Please login with social account."
        );
        return res.redirect("/login");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if(!isPasswordValid){
         req.flash("errors", "Invalid Email or Password");
         return res.redirect("/login");
    }
    // res.cookie("isLoggedIn", true);

    // const token = generateToken({
    //     id: user.id,
    //     name: user.name,
    //     email: user.email
    // }); 

    // res.cookie('access_token', token);

    await authenticateUser({req, res, user});
    
    res.redirect("/");
}

export const getMe = (req, res) =>{
    if (!req.user) return res.send("Not Logged in");
    return res.send(`<h1>Hey ${req.user.name} - ${req.user.email}</h1>`);
}

export const logoutUser =  async (req, res) =>{

    await clearUserSession(req.user.sessionId);

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.redirect("/login");
}

export const getProfilePage = async (req, res) => {
    if(!req.user) return res.send("Not Logged in");

    const user = await findUserById(req.user.id);
    if(!user) return res.redirect("/login");

    const userShortLinks = await getAllShortLinks(user.id);

    return res.render("auth/profile", {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isEmailValid: user.isEmailValid,
            hasPassword: Boolean(user.password),
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            links: userShortLinks,
        },
    });

}

export const getVerifyEmailPage = async (req, res) => {
    // if(!req.user || req.user.isEmailValid) return res.redirect("/");

    if(!req.user) return res.redirect("/");

    const user = await findUserById(req.user.id);

    if(!user || user.isEmailValid) return res.redirect("/");

    return res.render("auth/verify-email", {
        email: req.user.email,
    });
}

export const resendVerificationLink = async (req, res) =>{
    if(!req.user) return res.redirect("/");

    const user = await findUserById(req.user.id);

    if(!user || user.isEmailValid) return res.redirect("/");

    // const randomToken = await generateRandomToken();

    // await insertVerifyEmailToken({userId: req.user.id, token: randomToken});
    

    // const verifyEmailLink = await createVerifyEmailLink({
    //     email: req.user.email,
    //     token: randomToken,
    // });

    // sendEmail({
    //     to: req.user.email,
    //     subject: "Verify your email",
    //     html: `
    //     <h1>Click the link below to verify your email</h1>
    //     <p>You can use this token: <code>${randomToken}</code></p>
    //     <a href="${verifyEmailLink}">Verify Email</a>
    //     `,
    // }).catch(console.error);

    // here we add updated version of code........

    await sendNewVerifyEmailLink({email: req.user.email, userId: req.user.id});

    res.redirect("/verify-email");

}

export const verifyEmailToken = async (req, res) => {
    const {data, error} = verifyEmailSchema.safeParse(req.query);
    if (error) {
        return res.send("Verification link invalid or expired!");
    }

    // const token = await findVerificationEmailToken(data);  // without joins

    const [token] = await findVerificationEmailToken(data);  //with joins
    console.log("verifyEmailToken - token: ", token);
    if (!token) return res.send("Verification link invalid or expired!");
    
    
    await verifyUserEmailAndUpdate(token.email);

    clearVerifyEmailTokens(token.email).catch(console.error);

    return res.redirect("/profile");

};

export const getEditProfilePage = async (req, res) => {
    if (!req.user) return res.redirect("/");

    const user = await findUserById(req.user.id);
    if(!user) return res.status(404).send("User not found!");
    
    return res.render("auth/edit-profile", {
        name: user.name,
        avatarUrl: user.avatarUrl,
        errors: req.flash("errors"),
    });
};

export const postEditProfile = async (req , res) =>{
     if (!req.user) return res.redirect("/");

     const {data, error} =  verifyUserSchema.safeParse(req.body);
     if (error) {
        const errorMessage = error.issues.map((err) => err.message);
        req.flash("errors", errorMessage);
        return res.redirect("/edit-profile");
     }

     // Only update avatar if a file was uploaded
     const updateData = {userId: req.user.id, name: data.name};
     
     if (req.file) {
       updateData.avatarUrl = `/uploads/avatar/${req.file.filename}`;
     }

     await updateUserByName(updateData);

     return res.redirect("/profile");
}


export const getChangePasswordPage = async (req,res) => {
    if (!req.user) return res.redirect("/");
    return res.render("auth/change-password", {
        errors: req.flash("errors"),
    });
}

export const postChangePassword = async (req, res) =>{
    const {data, error} = verifyPasswordSchema.safeParse(req.body);
     if (error) {
        const errorMessage = error.issues.map((err) => err.message);
        req.flash("errors", errorMessage);
        return res.redirect("/change-password");
     }


     const {currentPassword, newPassword} = data;

     const user = await findUserById(req.user.id);
     if (!user) return res.status(404).send("User not found!");

     const isPasswordValid = await comparePassword(currentPassword, user.password);

     if(!isPasswordValid){
        req.flash("errors", "Current Password you enter is invalid!");
        return res.redirect("/change-password");  
     }

     await updateUserPassword({userId: user.id, newPassword});

     return res.redirect("/profile");
};

export const getResetPasswordPage = async (req,res) => {
    return res.render("auth/forgot-password", {
        formSubmitted: req.flash("formSubmitted")[0],
        errors: req.flash("errors"),
    });
}

export const postForgotPassword =  async (req , res) =>{
    const {data, error} = forgotPasswordSchema.safeParse(req.body);

     if (error) {
        const errorMessage = error.issues.map((err) => err.message);
        req.flash("errors", errorMessage);
        return res.redirect("/reset-password");
     }
     const user =  await findUserByEmail(data.email);

     if (user) {
        const resetPaswordLink = await createResetPasswordLink({
            userId: user.id,
        });

        const html = await getHtmlFromMjmlTemplate("reset-password-email", {
            name: user.name,
            link: resetPaswordLink,
        });

        
        sendEmail({
            to: user.email,
            subject: "Reset Your Password",
            html,
        });
     }
     req.flash("formSubmitted", true);
     return res.redirect("/reset-password");
};

export const getResetPasswordTokenPage = async (req,res) => {
    const {token} = req.params;
    const passwordResetData = await getResetPasswordToken(token);
    if(!passwordResetData) return res.render("auth/wrong-reset-password-token");

    return res.render("auth/reset-password", {
        formSubmitted: req.flash("formSubmitted")[0],
        errors: req.flash("errors"),
        token,
    });
}

export const postResetPasswordToken = async(req, res) => {
     const {token} = req.params;
    const passwordResetData = await getResetPasswordToken(token);
    if(!passwordResetData){
        req.flash("errors", "Password token is not matching");
         return res.render("auth/wrong-reset-password-token");
    }
    const {data, error} = verifyResetPasswordSchema.safeParse(req.body);
     if (error) {
        const errorMessage = error.issues.map((err) => err.message);
        req.flash("errors", errorMessage);
        return res.redirect(`/reset-password/${token}`);
     }

     const {newPassword} =  data;

     const user = await findUserById(passwordResetData.userId);

     await clearResetPasswordToken(user.id);

     await updateUserPassword({userId: user.id, newPassword});

     return res.redirect("/login");
};

export const getGoogleLoginPage = async(req,res) => {
    if (req.user) return res.redirect("/");

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, [
        "openid",
        "profile",
        "email",
    ]);
    
    const cookieConfig = {
        httpOnly: true,
        secure: true,
        maxAge: OAUTH_EXCHANGE_EXPIRY,
        sameSite: "lax",
    };

    res.cookie("google_oauth_state", state, cookieConfig);
    res.cookie("google_code_verifier", codeVerifier, cookieConfig);

    res.redirect(url.toString());

};


export const getGoogleLoginCallback = async (req,res) => {
    const {code , state} = req.query;
    console.log(code, state);

    const {
        google_oauth_state: storedState,
        google_code_verifier: codeVerifier
    } = req.cookies;

    if (
        !code ||
        !state ||
        !storedState ||
        !codeVerifier ||
        state != storedState
    ) {
        req.flash(
            "errors",
            "Coudn't login with google because of invalid login attempt. Please try again!"
        );
        return res.redirect("/login");
    }

    let tokens;
    try {
        tokens = await google.validateAuthorizationCode(code, codeVerifier);
    } catch (error) {
        req.flash(
          "errors",
            "Coudn't login with Google because of invalid login attempt. Please try again!"
        );
        
        return res.redirect("/login");
    }
    console.log("token google: ", tokens);

    const claims = decodeIdToken(tokens.idToken());
    const {sub: googleUserId, name, email} = claims;

    let user = await getUserWithOauthId({
        provider: "google",
        email,
    });

    if (user && !user.providerAccountId){
        await linkUserWithOauth({
            userId: user.id,
            provider: "google",
            providerAccountId: googleUserId,
        });
    }

    if (!user) {
        user = await createUserWithOauth({
            name,
            email,
            provider: "google",
            providerAccountId: googleUserId,
        });
    }
    await authenticateUser({req, res, user, name, email});
    res.redirect("/");
};

export const getGithubLoginPage = async (req,res) => {
    if (req.user) return res.redirect("/");

    const state = generateState();
    const url = github.createAuthorizationURL(state, ["user:email"]);
    
    const cookieConfig = {
        httpOnly: true,
        secure: true,
        maxAge: OAUTH_EXCHANGE_EXPIRY,
        sameSite: "lax",
    };

    res.cookie("github_oauth_state", state, cookieConfig);

    res.redirect(url.toString());
}

// githubCallback function.........

export const getGithubLoginCallback = async (req, res) => {
  const { code, state } = req.query;
  const { github_oauth_state: storedState } = req.cookies;

  function handleFailedLogin() {
    req.flash(
      "errors",
      "Couldn't login with GitHub because of invalid login attempt. Please try again!"
    );
    return res.redirect("/login");
  }

  if (!code || !state || !storedState || state !== storedState) {
    return handleFailedLogin();
  }

  let tokens;
  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch {
    return handleFailedLogin();
  }

  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  if (!githubUserResponse.ok) return handleFailedLogin();
  const githubUser = await githubUserResponse.json();
  const { id: githubUserId, name } = githubUser;

  const githubEmailResponse = await fetch(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    }
  );
  if (!githubEmailResponse.ok) return handleFailedLogin();

  const emails = await githubEmailResponse.json();
  const email = emails.filter((e) => e.primary)[0].email; // In GitHub we can have multiple emails, but we only want primary email
  if (!email) return handleFailedLogin();

  // there are few things that we should do
  //! Condition 1: User already exists with github's oauth linked
  //! Condition 2: User already exists with the same email but google's oauth isn't linked
  //! Condition 3: User doesn't exist.

  let user = await getUserWithOauthId({
    provider: "github",
    email,
  });

  if (user && !user.providerAccountId) {
    await linkUserWithOauth({
      userId: user.id,
      provider: "github",
      providerAccountId: githubUserId,
    });
  }

  if (!user) {
    user = await createUserWithOauth({
      name,
      email,
      provider: "github",
      providerAccountId: githubUserId,
    });
  }

  await authenticateUser({ req, res, user, name, email });

  res.redirect("/");
};

// here is some bug code which we correct and update above...
// export const getGithubLoginCallback = async (req, res) => {
//     const {code , state} = req.query;
//     const {github_oauth_state: storedState} = req.cookies;

//     function handleFailedLogin() {
//         req.flash(
//             "errors",
//             "Coudn't login with Github because of invalid login attempt. Please try again!"
//         );
//         return res.redirect("/login");
//     }
//     if (
//         !code ||
//         !state ||
//         !storedState ||
//         state != storedState
//     ){
//         return handleFailedLogin();
//     }
//     let tokens;
    
//     try {
//         tokens = await github.validateAuthorizationCode(code);
//     } catch (error) {
//         return handleFailedLogin();
//     }

//     const githubUserResponse = await fetch("https://api.github.com/user", {
//         headers: {
//             Authorization: `Bearer ${tokens.accessToken()}`,
//         },
//     });
//     if (!githubUserResponse.ok) return handleFailedLogin();
//     const githubUser = await githubUserResponse.json();
//     const {id: githubUserId, name} = githubUser;

//     const githubEmailResponse = await fetch("https://api.github.com/user/emails", {
//         headers: {
//             Authorization: `Bearer ${tokens.accessToken()}`,
//         },
//     });
//     if (!githubEmailResponse.ok) return handleFailedLogin();
//     const emails = await githubEmailResponse.json();
//     const email = emails.filter((e) => e.primary)[0].email;

//     if(!email) return handleFailedLogin();

//     let user = await getUserWithOauthId({
//         provider: "github",
//         email,
//     });
    
//     if (user && !user.providerAccountId){
//         await linkUserWithOauth({
//             userId: user.id,
//             provider: "github",
//             providerAccountId: githubUserId,
//         });
//     }
//     if (!user) {
//         user = await createUserWithOauth({
//             name,
//             email,
//             provider: "github",
//             providerAccountId: githubUserId,
//         });
//     }
//     await authenticateUser({req, res, user, name, email});
//     res.redirect("/");
// }


export const getSetPasswordPage = async (req, res) =>{
    if (!req.user) return res.redirect("/");

    return res.render("auth/set-password", {
        errors: req.flash("errors")
    });
}

export const postSetPassword = async (req , res) =>{
    if (!req.user)  return res.redirect("/");

    const {data, error} = setPasswordSchema.safeParse(req.body);
    
     if (error) {
        const errorMessage = error.issues.map((err) => err.message);
        req.flash("errors", errorMessage);
        return res.redirect("/set-password");
     }

     const {newPassword} = data;

     const user = await findUserById(req.user.id);
     if(user.password){
        req.flash(
            "errors",
            "You already have your Password, Instead change your password."
        );
        return res.redirect("/set-password");
     }

     await updateUserPassword({userId: req.user.id, newPassword});

     return res.redirect("/profile");
}