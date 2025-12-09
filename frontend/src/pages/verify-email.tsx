import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const VerifyEmail = () => {
    const router = useRouter();
    const { token } = router.query;
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log('VerifyEmail mounted, router.isReady:', router.isReady, 'token:', token);

        if (!router.isReady) return;

        const tokenStr = Array.isArray(token) ? token[0] : token;

        if (!tokenStr) {
            console.error('No token found');
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        const verify = async () => {
            try {
                console.log('Verifying token:', tokenStr);
                const response = await axios.get(`http://localhost:5000/auth/verify-email?token=${tokenStr}`);
                console.log('Verification success:', response.data);
                setStatus('success');
            } catch (error: any) {
                console.error('Verification failed:', error);
                setStatus('error');
                setMessage(error.response?.data?.error || 'Verification failed');
            }
        };

        verify();
    }, [router.isReady, token]);

    console.log('Current status:', status);

    if (status === 'verifying') {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h1>Verifying your email...</h1>
                <p>Please wait.</p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div style={{ padding: '50px', textAlign: 'center', color: 'green' }}>
                <h1>Email Verified!</h1>
                <p>Your email has been successfully verified.</p>
                <Link href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
            <h1>Verification Failed</h1>
            <p>{message}</p>
            <Link href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
                Back to Login
            </Link>
        </div>
    );
};

export default VerifyEmail;
