
// Firebase Configuration (You'll need to replace this with your actual Firebase config)
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "fip-academy.firebaseapp.com",
    projectId: "fip-academy",
    storageBucket: "fip-academy.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id-here"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let selectedCourseData = '';
let currentUser = null;

// Demo mode for this example (since we don't have actual Firebase project)
const DEMO_MODE = true;
let demoUsers = [];

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const authForms = document.getElementById('authForms');
    authForms.insertBefore(alertDiv, authForms.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function showLoadingState() {
    document.getElementById('authForms').style.display = 'none';
    document.getElementById('loadingState').style.display = 'block';
}

function hideLoadingState() {
    document.getElementById('authForms').style.display = 'block';
    document.getElementById('loadingState').style.display = 'none';
}

function showSignupForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Handle Sign Up
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'error');
        return;
    }

    showLoadingState();

    try {
        if (DEMO_MODE) {
            // Demo implementation
            const existingUser = demoUsers.find(user => user.email === email);
            if (existingUser) {
                throw new Error('User already exists');
            }
            
            const newUser = {
                uid: 'demo_' + Date.now(),
                email: email,
                name: name,
                enrolledCourse: selectedCourseData || 'No course selected',
                joinDate: new Date().toLocaleDateString(),
                progress: 0,
                assignmentsCompleted: 0,
                grade: 'New Student'
            };
            
            demoUsers.push(newUser);
            currentUser = newUser;
            
            setTimeout(() => {
                hideLoadingState();
                showAlert('Account created successfully! Logging you in...', 'success');
                setTimeout(() => {
                    showDashboard();
                }, 1500);
            }, 2000);
        } else {
            // Real Firebase implementation
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Store additional user data in Firestore
            await db.collection('users').doc(user.uid).set({
                name: name,
                email: email,
                enrolledCourse: selectedCourseData || 'No course selected',
                joinDate: firebase.firestore.FieldValue.serverTimestamp(),
                progress: 0,
                assignmentsCompleted: 0,
                grade: 'New Student'
            });

            hideLoadingState();
            showAlert('Account created successfully!', 'success');
        }
    } catch (error) {
        hideLoadingState();
        showAlert(error.message, 'error');
    }
});

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    showLoadingState();

    try {
        if (DEMO_MODE) {
            // Demo implementation
            const user = demoUsers.find(u => u.email === email);
            if (!user) {
                throw new Error('No account found with this email. Please sign up first.');
            }
            
            currentUser = user;
            
            setTimeout(() => {
                hideLoadingState();
                showDashboard();
            }, 1500);
        } else {
            // Real Firebase implementation
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Get user data from Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            currentUser = { uid: user.uid, ...userDoc.data() };
            
            hideLoadingState();
            showDashboard();
        }
    } catch (error) {
        hideLoadingState();
        showAlert(error.message, 'error');
    }
}

function showDashboard() {
    // Hide main website and show student dashboard
    document.querySelector('header').style.display = 'none';
    document.querySelector('main').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    document.getElementById('studentDashboard').style.display = 'block';
    
    // Update dashboard with user data
    updateDashboardData();
}

function updateDashboardData() {
    if (currentUser) {
        // Update course enrollment
        document.getElementById('selectedCourse').innerHTML = 
            `You are enrolled in: <strong>${currentUser.enrolledCourse}</strong>`;
        
        // Update profile modal with real data
        document.querySelector('#profileModal .modal-content').innerHTML = `
            <span class="close">&times;</span>
            <h2>👤 Profile</h2>
            <p>Manage your account and personal information.</p>
            <div style="margin-top: 1rem;">
                <p><strong>Name:</strong> ${currentUser.name}</p>
                <p><strong>Email:</strong> ${currentUser.email}</p>
                <p><strong>Enrolled Course:</strong> ${currentUser.enrolledCourse}</p>
                <p><strong>Join Date:</strong> ${currentUser.joinDate}</p>
                <p><strong>Progress:</strong> ${currentUser.progress}%</p>
            </div>
        `;

        // Update dashboard modal
        document.querySelector('#dashboardModal .modal-content').innerHTML = `
            <span class="close">&times;</span>
            <h2>📊 Dashboard</h2>
            <p>Your learning overview and progress statistics.</p>
            <div style="margin-top: 1rem;">
                <p><strong>Course Progress:</strong> ${currentUser.progress}% Complete</p>
                <p><strong>Assignments Completed:</strong> ${currentUser.assignmentsCompleted}/8</p>
                <p><strong>Current Grade:</strong> ${currentUser.grade}</p>
                <p><strong>Study Streak:</strong> 7 days</p>
            </div>
        `;
        
        // Update course outline based on enrolled course
        updateCourseOutline(currentUser.enrolledCourse);
    }
}

function updateCourseOutline(courseName) {
    const courseOutlines = {
        'Web3 Foundations Course': {
            title: 'Web3 Foundations & Blockchain Fundamentals',
            description: 'This comprehensive outline covers the essential skills and knowledge for understanding Web3 fundamentals and blockchain technology, emphasizing practical applications.',
            courses: [
                {
                    name: 'Course 1: Introduction to Web3 & Evolution',
                    topics: [
                        '– Overview of Web3 ecosystem and evolution',
                        '– Understanding decentralization principles', 
                        '– Blockchain fundamentals and architecture',
                        '– Consensus mechanisms (PoW, PoS, Layer 2)'
                    ]
                },
                {
                    name: 'Course 2: Blockchain Architecture & Protocols',
                    topics: [
                        '– Deep dive into blockchain structure',
                        '– Smart contract fundamentals',
                        '– Network protocols and communication',
                        '– Scalability solutions and Layer 2'
                    ]
                },
                {
                    name: 'Course 3: Cryptocurrency & Token Economics',
                    topics: [
                        '– Understanding different token types',
                        '– Tokenomics and economic models',
                        '– DeFi protocols and mechanisms',
                        '– Yield farming and liquidity mining'
                    ]
                }
            ]
        },
        'Digital Asset Creator': {
            title: 'Digital Asset Creation & NFT Mastery',
            description: 'This comprehensive outline covers the essential skills and knowledge for creating, managing, and monetizing digital assets in the Web3 space.',
            courses: [
                {
                    name: 'Course 1: NFT Fundamentals & Technology',
                    topics: [
                        '– Understanding NFT technology and standards',
                        '– ERC-721 vs ERC-1155 token standards',
                        '– Smart contract basics for creators',
                        '– Blockchain platforms comparison'
                    ]
                },
                {
                    name: 'Course 2: Digital Art Creation & Design',
                    topics: [
                        '– Digital art tools and software mastery',
                        '– Creating compelling visual narratives',
                        '– Generative art and algorithmic creation',
                        '– Brand development for digital artists'
                    ]
                },
                {
                    name: 'Course 3: Minting & Marketplace Strategy',
                    topics: [
                        '– Minting process and cost optimization',
                        '– Marketplace selection and optimization',
                        '– Pricing strategies and market analysis',
                        '– Collection planning and roadmaps'
                    ]
                }
            ]
        },
        'Community & Marketing Specialist': {
            title: 'Web3 Community & Marketing Mastery',
            description: 'This comprehensive outline covers the essential skills for building and managing Web3 communities while executing effective marketing strategies.',
            courses: [
                {
                    name: 'Course 1: Community Building Fundamentals',
                    topics: [
                        '– Discord server setup and management',
                        '– Telegram group optimization',
                        '– Community engagement strategies',
                        '– Moderation and conflict resolution'
                    ]
                },
                {
                    name: 'Course 2: Social Media & X/Twitter Strategy',
                    topics: [
                        '– X/Twitter growth and engagement',
                        '– Content creation and scheduling',
                        '– Influencer partnerships and collaborations',
                        '– Viral marketing techniques'
                    ]
                },
                {
                    name: 'Course 3: Web3 Marketing & Growth Hacking',
                    topics: [
                        '– Web3-specific marketing channels',
                        '– Ambassador programs and referrals',
                        '– Partnership and collaboration strategies',
                        '– Metrics tracking and optimization'
                    ]
                }
            ]
        },
        'DeFi & Trading Mastery': {
            title: 'DeFi Protocols & Trading Mastery',
            description: 'This comprehensive outline covers essential skills for understanding DeFi protocols, trading strategies, and risk management in the decentralized finance ecosystem.',
            courses: [
                {
                    name: 'Course 1: DeFi Fundamentals & Protocol Analysis',
                    topics: [
                        '– Understanding DeFi ecosystem and protocols',
                        '– Automated Market Makers (AMMs) deep dive',
                        '– Liquidity pools and yield farming strategies',
                        '– Protocol security and smart contract risks'
                    ]
                },
                {
                    name: 'Course 2: On-Chain Analysis & Research Tools',
                    topics: [
                        '– Using Etherscan and block explorers effectively',
                        '– DeFiPulse, DeBank, and portfolio tracking',
                        '– Whale watching and transaction analysis',
                        '– Market sentiment and on-chain metrics'
                    ]
                },
                {
                    name: 'Course 3: Trading Strategies & Risk Management',
                    topics: [
                        '– Spot trading and technical analysis',
                        '– DeFi arbitrage opportunities',
                        '– Position sizing and portfolio management',
                        '– Risk assessment and mitigation strategies'
                    ]
                }
            ]
        },
        'Web3 Product Manager': {
            title: 'Web3 Product Management & Strategy',
            description: 'This comprehensive outline covers the essential skills for managing Web3 products, from conception to launch and beyond.',
            courses: [
                {
                    name: 'Course 1: Web3 Product Strategy & Market Research',
                    topics: [
                        '– Web3 product lifecycle and development',
                        '– Market research and competitive analysis',
                        '– User research in decentralized environments',
                        '– Product-market fit in Web3 ecosystems'
                    ]
                },
                {
                    name: 'Course 2: Token Economics & Launch Planning',
                    topics: [
                        '– Tokenomics design and modeling',
                        '– Token distribution and vesting schedules',
                        '– Launch strategies and go-to-market planning',
                        '– Community building and early adoption'
                    ]
                },
                {
                    name: 'Course 3: Roadmap Development & Execution',
                    topics: [
                        '– Agile development in Web3 environments',
                        '– Cross-functional team coordination',
                        '– Milestone planning and progress tracking',
                        '– Post-launch optimization and scaling'
                    ]
                }
            ]
        },
        'Web3 Designer & NFT Artist': {
            title: 'Web3 Design & Visual Creation Mastery',
            description: 'This comprehensive outline covers the essential skills for creating compelling visual designs and NFT art in the Web3 space.',
            courses: [
                {
                    name: 'Course 1: Design Fundamentals for Web3',
                    topics: [
                        '– Design principles for blockchain interfaces',
                        '– Color theory and visual hierarchy',
                        '– Typography and brand consistency',
                        '– User experience design for DApps'
                    ]
                },
                {
                    name: 'Course 2: NFT Art Creation & Tools',
                    topics: [
                        '– Digital art software mastery (Photoshop, Illustrator)',
                        '– 3D modeling and animation techniques',
                        '– Generative art and coding for artists',
                        '– Creating cohesive NFT collections'
                    ]
                },
                {
                    name: 'Course 3: Branding & Marketplace Optimization',
                    topics: [
                        '– Building visual brand identity',
                        '– Marketplace presentation and optimization',
                        '– Community engagement through visuals',
                        '– Pricing strategies for digital art'
                    ]
                }
            ]
        },
        'Web3 Career Transition': {
            title: 'Web3 Career Development & Job Readiness',
            description: 'This comprehensive outline covers the essential skills and strategies for successfully transitioning into Web3 careers and landing your dream job.',
            courses: [
                {
                    name: 'Course 1: Web3 Job Market & Opportunities',
                    topics: [
                        '– Overview of Web3 job landscape and roles',
                        '– Salary expectations and negotiation strategies',
                        '– Remote work and global opportunities',
                        '– Freelancing vs full-time employment'
                    ]
                },
                {
                    name: 'Course 2: Portfolio Development & Personal Branding',
                    topics: [
                        '– Building a compelling Web3 portfolio',
                        '– GitHub and project showcase strategies',
                        '– LinkedIn and social media optimization',
                        '– Content creation and thought leadership'
                    ]
                },
                {
                    name: 'Course 3: Networking & Interview Preparation',
                    topics: [
                        '– Web3 networking events and communities',
                        '– Technical interview preparation',
                        '– Behavioral interviews and culture fit',
                        '– Salary negotiation and offer evaluation'
                    ]
                }
            ]
        },
        'Blockchain Developer': {
            title: 'Blockchain Development & Smart Contracts',
            description: 'This comprehensive outline covers advanced technical skills for building decentralized applications and smart contracts.',
            courses: [
                {
                    name: 'Course 1: Solidity Programming & Smart Contracts',
                    topics: [
                        '– Solidity syntax and programming fundamentals',
                        '– Smart contract architecture and patterns',
                        '– Gas optimization and efficiency techniques',
                        '– Testing and debugging smart contracts'
                    ]
                },
                {
                    name: 'Course 2: DApp Development with React & Web3.js',
                    topics: [
                        '– Frontend integration with blockchain',
                        '– Web3.js and Ethers.js libraries',
                        '– Wallet integration and user authentication',
                        '– State management in decentralized apps'
                    ]
                },
                {
                    name: 'Course 3: Advanced Topics & Security',
                    topics: [
                        '– Token standards (ERC-20, ERC-721, ERC-1155)',
                        '– Security audits and vulnerability assessment',
                        '– Deployment strategies and DevOps',
                        '– Capstone project development'
                    ]
                }
            ]
        }
    };

    const courseOutline = courseOutlines[courseName] || courseOutlines['Web3 Foundations Course'];
    
    let coursesHTML = '';
    courseOutline.courses.forEach(course => {
        coursesHTML += `
            <div style="margin-bottom: 2rem;">
                <h4 style="color: #c77dff; margin-bottom: 1rem; font-size: 1.1rem;">${course.name}</h4>
                <div style="margin-left: 1rem; color: #e0e0e0;">
                    ${course.topics.map(topic => `<p style="margin: 0.5rem 0;">${topic}</p>`).join('')}
                </div>
            </div>
        `;
    });

    document.getElementById('courseOutlineContent').innerHTML = `
        <div style="border: 1px solid rgba(199, 125, 255, 0.3); border-radius: 10px; background: rgba(0,0,0,0.2); margin: 1rem 0;">
            <div style="background: #7b2cbf; color: white; padding: 1rem; border-radius: 10px 10px 0 0;">
                <h3 style="margin: 0; color: white;">${courseOutline.title}</h3>
            </div>
            <div style="padding: 1.5rem;">
                <p style="color: #e0e0e0; line-height: 1.6; margin-bottom: 1.5rem;">
                    ${courseOutline.description}
                </p>
                ${coursesHTML}
            </div>
        </div>
    `;
}

function selectCourse(courseType) {
    const courseNames = {
        'foundations': 'Web3 Foundations Course',
        'nft': 'Digital Asset Creator',
        'marketing': 'Community & Marketing Specialist',
        'defi': 'DeFi & Trading Mastery',
        'product': 'Web3 Product Manager',
        'design': 'Web3 Designer & NFT Artist',
        'career': 'Web3 Career Transition',
        'developer': 'Blockchain Developer'
    };
    
    selectedCourseData = courseNames[courseType];
    showAlert(`Great choice! You've selected: ${selectedCourseData}. Please create an account or login to enroll.`, 'success');
    
    // Scroll to login section
    document.getElementById('login').scrollIntoView({ behavior: 'smooth' });
}

function openModal(modalType) {
    const modal = document.getElementById(modalType + 'Modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function showRegisteredCourses() {
    document.querySelector('.dashboard-grid').style.display = 'none';
    document.querySelector('.faq-section').style.display = 'none';
    document.getElementById('registeredCoursesSection').style.display = 'block';
    
    if (currentUser && currentUser.enrolledCourse && currentUser.enrolledCourse !== 'No course selected') {
        document.getElementById('courseStatus').textContent = `You are enrolled in: ${currentUser.enrolledCourse}`;
    }
}

function backToDashboard() {
    document.querySelector('.dashboard-grid').style.display = 'grid';
    document.querySelector('.faq-section').style.display = 'block';
    document.getElementById('registeredCoursesSection').style.display = 'none';
}

async function logout() {
    try {
        if (!DEMO_MODE) {
            await auth.signOut();
        }
        
        currentUser = null;
        selectedCourseData = '';
        
        // Show main website and hide student dashboard
        document.querySelector('header').style.display = 'block';
        document.querySelector('main').style.display = 'block';
        document.querySelector('footer').style.display = 'block';
        document.getElementById('studentDashboard').style.display = 'none';
        
        // Clear forms
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        // Reset to login form
        showLoginForm();
        
        showAlert('You have been logged out successfully!', 'success');
    } catch (error) {
        showAlert('Error logging out: ' + error.message, 'error');
    }
}

// Close modals when clicking the X or outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Close modal when clicking X
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('close')) {
        event.target.closest('.modal').style.display = 'none';
    }
});

// Monitor auth state changes (for real Firebase)
if (!DEMO_MODE) {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userDoc = await db.collection('users').doc(user.uid).get();
            currentUser = { uid: user.uid, ...userDoc.data() };
            showDashboard();
        } else {
            currentUser = null;
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add some interactive animations
window.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.feature-card, .curriculum-module');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardVisible = 150;
        
        if (cardTop < window.innerHeight - cardVisible) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// Initialize card animations
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .curriculum-module');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    });
});


