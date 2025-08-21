import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

export function googleService() {
    GoogleSignin.configure({
        webClientId: Config.GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
        iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
        profileImageSize: 120,
    });
}
