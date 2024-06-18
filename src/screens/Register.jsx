import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FbLogo from '../../assets/fb-icon.png';
import GoogleLogo from '../../assets/google_icon.png';
import Button from '../components/Button';
import Input from '../components/Input';
import SocialButton from '../components/SocialButton';
import { COLORS } from '../constants';
import tw from '../customtwrnc';
import { configureGoogleSignIn, getUsername, GoogleSignUp, register } from '../redux/actions/user';


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');


    const { usernames } = useSelector(store => store.user);
    const navigation = useNavigation();
    const dispatch = useDispatch();


    useEffect(() => {
        configureGoogleSignIn();

    }, []);

    const handleGoogleSignIn = async () => {
        try {
            const res = await dispatch(GoogleSignUp());
            if (res && typeof res === 'object') {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'home' }],
                });
            } else if (res) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'keyword' }],
                });
            }
        } catch (error) {
            ToastAndroid.show('Google sign in failed.', ToastAndroid.SHORT);
        }
    }

    const handleRegister = async (async) => {
        if (!email || !password || !name) {
            ToastAndroid.show('Please fill all fields.', ToastAndroid.SHORT);
            return
        }
        const res = await dispatch(register(email, password, name, username));
        if (res) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'keyword' }],
            });
        }
    }

    useEffect(() => {
        if (username !== username.toLowerCase()) {
            setError('Username must be in lowercase');
        } else if (usernames.includes(username)) {
            setError('This username is already taken');
        } else {
            setError('');
        }
    }, [username]);

    useEffect(() => {
        (async function () {
            dispatch(getUsername())
        })()
    }, [])
    return (
        <View style={tw`flex-1 bg-[${COLORS.primary}] flex justify-center items-center`}>
            <View style={tw` w-[18rem] py-4 rounded-md`}>
                <View style={tw`flex items-center`}>
                    <Image source={require('../../assets/logo.png')} style={{ width: 60, height: 60, resizeMode: 'contain', marginBottom: 5 }} />
                </View>


                <Input placeholder={"Enter Your name"} value={name} setValue={setName} />
                <Input autoCapitalize='none' placeholder={"Enter Your username"} value={username} setValue={setUsername} />
                {error && <Text style={tw`text-xs text-red-400 px-2 font-montserrat`}>{error}</Text>}

                <Input keyboardType={'email-address'} placeholder={"Enter Your email"} value={email} setValue={setEmail} />
                <Input placeholder={"Enter Your password"} value={password} setValue={setPassword} secureTextEntry={true} />

                <View style={tw`mb-4 mt-1 flex flex-row justify-center`}>
                    <View style={tw`flex flex-row items-center gap-1`}>
                        <Text style={tw.style(`text-[${COLORS.white}] text-[12px]`, { fontFamily: 'Montserrat' })}>You Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('login')}>
                            <Text style={tw.style(`text-[${COLORS.secondary}] text-[13px]`, { fontFamily: 'Montserrat' })}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Button onPress={handleRegister}>SIGN UP</Button>

                <SocialButton
                    logo={GoogleLogo}
                    color="#fff"
                    textColor={'rgb(64 64 64);'}
                    text="Sign in with Google"
                    onPress={handleGoogleSignIn}
                />
                <SocialButton
                    logo={FbLogo}
                    color="rgb(59 130 246)"
                    text="Sign in with Facebook"
                    textColor={'white'}
                    onPress={() => {
                        ToastAndroid.show('Feature coming soon.', ToastAndroid.SHORT);
                        handleRegister()
                    }}
                />
            </View>
        </View>
    )
}

export default Register