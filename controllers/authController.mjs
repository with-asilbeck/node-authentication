import UserModel from '../models/user.mjs';

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: "", password: "" };

    if (err.message === 'Incorrect email') {
        errors.email = 'That email is not registered';
    }

    if (err.message === 'Incorrect password') {
        errors.password = 'That password is incorrect';
    }

    if (err.code === 11000) {
        errors.email = "That email is already registered";
        return errors; // No need to handle password here
    }

    if (err.message.includes('users validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors; // Ensure an errors object is always returned
};


export const signup_get = (req, res) => {
    res.render('SignUp');
}

export const signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const newUser = await UserModel.create({ email, password })
        const token = createToken(newUser._id)
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json({user: newUser._id})
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).send({ errors })
    }
}

export const login_get = (req, res) => {
    res.render('Login');
}

export const login_post = async(req, res) => {
    const { email, password } = req.body

    try{
      const user = await UserModel.login(email, password)
      const token = createToken(user._id)
      res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
      res.status(200).json({user: user._id})
    }catch(err){
        const errors = handleErrors(err)
       res.status(400).json({ errors })
    }
}