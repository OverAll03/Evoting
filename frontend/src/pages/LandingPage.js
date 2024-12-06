import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Welcome to the E-Voting Platform</h1>
                <p style={styles.subtitle}>Experience secure and transparent voting powered by blockchain technology.</p>
                <Link to="/home">
                    <button style={styles.button}>Get Started</button>
                </Link>
            </header>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#e9ecef',
        fontFamily: 'Arial, sans-serif',
        color: '#343a40',
        textAlign: 'center',
    },
    header: {
        maxWidth: '600px',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '15px',
        fontWeight: 'bold',
        color: '#007bff',
    },
    subtitle: {
        fontSize: '1.2rem',
        marginBottom: '30px',
        color: '#6c757d',
    },
    button: {
        padding: '12px 24px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
};

export default LandingPage;

