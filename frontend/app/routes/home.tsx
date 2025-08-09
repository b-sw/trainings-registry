import { Link } from 'react-router';

export default function Home() {
    return (
        <div className="page">
            <h1>Welcome to Move for Ukraine</h1>
            <p>
                Discover and manage professional training courses and certifications. Our
                comprehensive registry helps you find the right training programs to advance your
                career and skills.
            </p>

            <h2>Featured Benefits</h2>
            <ul style={{ marginBottom: '2rem', paddingLeft: '2rem' }}>
                <li>Browse a wide variety of training courses</li>
                <li>Track your certification progress</li>
                <li>Connect with training providers</li>
                <li>Manage your learning portfolio</li>
            </ul>

            <Link to="/trainings" className="btn">
                Browse Trainings
            </Link>
        </div>
    );
}
