const users = {
    standard: { 
        username: 'standard_user', 
        password: 'secret_sauce' 
    },
    locked: { 
        username: 'locked_out_user', 
        password: 'secret_sauce' 
    },
    problem: { 
        username: 'problem_user', 
        password: 'secret_sauce' 
    },
    performance: { 
        username: 'performance_glitch_user', 
        password: 'secret_sauce' 
    },
    error: { 
        username: 'error_user', 
        password: 'secret_sauce' 
    },
    visual: { 
        username: 'visual_user', 
        password: 'secret_sauce' 
    },
    invalid: { 
        username: 'invalid_user', 
        password: 'invalid_password' 
    }
};

const loginErrors = {
    missingUsername: 'Epic sadface: Username is required',
    invalidCredentials: 'Epic sadface: Username and password do not match',
    lockedOut: 'Epic sadface: Sorry, this user has been locked out'
};

const loginUI = {
    usernamePlaceholder: 'Username',
    passwordPlaceholder: 'Password',
    loginButtonText: 'Login',
    defaultPassword: 'secret_sauce'
};

const acceptedUsers = [
    'standard_user',
    'locked_out_user',
    'problem_user',
    'performance_glitch_user',
    'error_user',
    'visual_user'
];

module.exports = {
    users,
    loginErrors,
    loginUI,
    acceptedUsers
};