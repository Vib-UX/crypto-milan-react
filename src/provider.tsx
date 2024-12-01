import React from 'react';
import Navbar from './components/navbar';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BuildType, OktoProvider } from 'okto-sdk-react';
import { Toaster } from 'react-hot-toast';

const Provider = ({ children }: { children: any }) => {
    return (
        <GoogleOAuthProvider
            clientId={
                '201737013329-1vammkv48a66k8ijo8fq6p1e34veqe0g.apps.googleusercontent.com'
            }
        >
            <OktoProvider
                apiKey={'0601c20e-0298-4fbf-97cb-d62508d253c8'}
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
                <div className="absolute top-0 bg-theme_bg w-full h-44" />
                <Navbar />
                {children}
            </OktoProvider>
        </GoogleOAuthProvider>
    );
};

export default Provider;
