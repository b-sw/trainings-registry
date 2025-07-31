import { Link } from 'react-router-dom'

const trainingsData = [
    {
        id: '1',
        title: 'React Development Fundamentals',
        description:
            'Learn the basics of React including components, state management, and hooks.',
        duration: '40 hours',
        level: 'Beginner',
    },
    {
        id: '2',
        title: 'Advanced TypeScript',
        description:
            'Master advanced TypeScript concepts including generics, decorators, and module systems.',
        duration: '32 hours',
        level: 'Advanced',
    },
    {
        id: '3',
        title: 'Node.js Backend Development',
        description:
            'Build scalable backend applications with Node.js, Express, and databases.',
        duration: '48 hours',
        level: 'Intermediate',
    },
    {
        id: '4',
        title: 'Cloud Architecture with AWS',
        description:
            'Design and implement cloud solutions using Amazon Web Services.',
        duration: '56 hours',
        level: 'Advanced',
    },
    {
        id: '5',
        title: 'DevOps and CI/CD Pipelines',
        description:
            'Learn modern DevOps practices including containerization and automated deployments.',
        duration: '44 hours',
        level: 'Intermediate',
    },
]

const Trainings = () => {
    return (
        <div className="page">
            <h1>Available Trainings</h1>
            <p>
                Browse our comprehensive collection of professional training
                courses.
            </p>

            <div style={{ marginTop: '2rem' }}>
                {trainingsData.map(training => (
                    <Link
                        key={training.id}
                        to={`/trainings/${training.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div className="training-card">
                            <h3>{training.title}</h3>
                            <p>{training.description}</p>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center',
                                }}
                            >
                                <span className="duration">
                                    Duration: {training.duration}
                                </span>
                                <span className="duration">
                                    Level: {training.level}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Trainings
