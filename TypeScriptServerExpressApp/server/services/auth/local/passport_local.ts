import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
interface User {
    //fn_ValidateUser: (email: string, password: string, done: Function) => void;
    fn_ValidateUser: (obj: any) => void;
}

function localAuthenticate(User: any, email: string, password: string, done: Function): any {
    console.log('validating user');
    let _usr: any = {};
    _usr['email'] = email.toLowerCase();
    _usr['password'] = password;
    
    var lookupArray = [];
    lookupArray.push({
        path: "groups",
        model: "group",
        select: "title",
        populate: {
            path: "grouppermission",
            model: "permission",
            select: "title"
        }
    });
    _usr['lookup'] = lookupArray;

    return User.default.fn_ValidateUser(_usr, done);
}

export function setup(User: User): void {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email: string, password: string, done: Function) {
        //console.log('validating user 0');
        return localAuthenticate(User, email, password, done);
    }));
}