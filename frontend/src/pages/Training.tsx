import { Link, useParams } from 'react-router-dom'

const trainingsData = [
    {
        id: '1',
        title: 'React Development Fundamentals',
        description:
            'Learn the basics of React including components, state management, and hooks.',
        duration: '40 hours',
        level: 'Beginner',
        prerequisites: 'Basic JavaScript knowledge',
        curriculum: [
            'Introduction to React and JSX',
            'Components and Props',
            'State and Event Handling',
            'React Hooks',
            'Context API',
            'Testing React Applications',
        ],
        instructor: 'Sarah Johnson',
        price: '$299',
    },
    {
        id: '2',
        title: 'Advanced TypeScript',
        description:
            'Master advanced TypeScript concepts including generics, decorators, and module systems.',
        duration: '32 hours',
        level: 'Advanced',
        prerequisites: 'Solid TypeScript fundamentals',
        curriculum: [
            'Advanced Type System',
            'Generics and Constraints',
            'Decorators and Metadata',
            'Module Systems',
            'TypeScript with React',
            'Performance Optimization',
        ],
        instructor: 'Michael Chen',
        price: '$399',
    },
    {
        id: '3',
        title: 'Node.js Backend Development',
        description:
            'Build scalable backend applications with Node.js, Express, and databases.',
        duration: '48 hours',
        level: 'Intermediate',
        prerequisites: 'JavaScript fundamentals',
        curriculum: [
            'Node.js Core Concepts',
            'Express.js Framework',
            'Database Integration',
            'Authentication & Authorization',
            'API Design & REST',
            'Deployment Strategies',
        ],
        instructor: 'David Rodriguez',
        price: '$449',
    },
    {
        id: '4',
        title: 'Cloud Architecture with AWS',
        description:
            'Design and implement cloud solutions using Amazon Web Services.',
        duration: '56 hours',
        level: 'Advanced',
        prerequisites: 'Basic cloud knowledge',
        curriculum: [
            'AWS Core Services',
            'Compute Services (EC2, Lambda)',
            'Storage Solutions (S3, EBS)',
            'Networking and Security',
            'Monitoring and Logging',
            'Cost Optimization',
        ],
        instructor: 'Emily Zhang',
        price: '$599',
    },
    {
        id: '5',
        title: 'DevOps and CI/CD Pipelines',
        description:
            'Learn modern DevOps practices including containerization and automated deployments.',
        duration: '44 hours',
        level: 'Intermediate',
        prerequisites: 'Basic system administration',
        curriculum: [
            'DevOps Fundamentals',
            'Version Control with Git',
            'Docker Containerization',
            'CI/CD Pipeline Design',
            'Infrastructure as Code',
            'Monitoring and Alerting',
        ],
        instructor: 'Alex Thompson',
        price: '$499',
    },
]

const Training = () => {
    const { id } = useParams()
    const training = trainingsData.find(t => t.id === id)

    if (!training) {
        return (
            <div className="page">
                <h1>Training Not Found</h1>
                <p>Sorry, the training you're looking for doesn't exist.</p>
                <Link to="/trainings" className="btn">
                    Back to Trainings
                </Link>
            </div>
        )
    }

    return (
        <div className="page">
            <div style={{ marginBottom: '1rem' }}>
                <Link
                    to="/trainings"
                    style={{ color: '#2563eb', textDecoration: 'none' }}
                >
                    ← Back to Trainings
                </Link>
            </div>

            <h1>{training.title}</h1>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '2rem',
                    marginTop: '2rem',
                }}
            >
                <div>
                    <h2>Description</h2>
                    <p>{training.description}</p>

                    <h2>Prerequisites</h2>
                    <p>{training.prerequisites}</p>

                    <h2>Curriculum</h2>
                    <ul style={{ paddingLeft: '2rem' }}>
                        {training.curriculum.map((item, index) => (
                            <li key={index} style={{ marginBottom: '0.5rem' }}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div
                    style={{
                        background: '#f8fafc',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        height: 'fit-content',
                    }}
                >
                    <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>
                        Course Details
                    </h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <strong>Duration:</strong> {training.duration}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <strong>Level:</strong> {training.level}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <strong>Instructor:</strong> {training.instructor}
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <strong>Price:</strong> {training.price}
                    </div>

                    <button
                        className="btn"
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Training
