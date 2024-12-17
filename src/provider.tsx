import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BuildType, OktoProvider } from 'okto-sdk-react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/navbar';
const Provider = ({ children }: { children: any }) => {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <GoogleOAuthProvider
                clientId={
                    '201737013329-1vammkv48a66k8ijo8fq6p1e34veqe0g.apps.googleusercontent.com'
                }
            >
                <OktoProvider
                    apiKey={'408eaa9d-35f3-43e5-87b1-1a20c26ae1e1'}
                    buildType={BuildType.SANDBOX}
                >
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                        gutter={8}
                        containerClassName=""
                        containerStyle={{}}
                        toastOptions={{
                            // Define default options
                            className: '',
                            duration: 5000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },

                            // Default options for specific types
                            success: {
                                duration: 3000,
                            },
                        }}
                    />
                    <Navbar />
                    {children}
                </OktoProvider>
            </GoogleOAuthProvider>
        </ThemeProvider>
    );
};

export default Provider;
