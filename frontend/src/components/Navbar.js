
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isHoveringPulseAI, setIsHoveringPulseAI] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const getLinkStyle = (path) => ({
        color: '#FFFFFF',
        // Removed border and background here, as the moving box will handle the active state visual
        padding: '8px 16px',
        margin: '0 4px',
        position: 'relative', // Needed for accurate measurement
        zIndex: 1, // Ensure text is above the moving box
    });

    // State for the moving indicator
    const [indicatorStyle, setIndicatorStyle] = useState({
        left: 0,
        width: 0,
        opacity: 0,
    });

    // Ref for the container of the navigation links to measure relative positions
    const navLinksRef = React.useRef(null);

    // Effect to update indicator position when location changes or component mounts/updates
    React.useEffect(() => {
        if (navLinksRef.current) {
            const activeLinkElement = navLinksRef.current.querySelector(`a[href="${location.pathname}"]`);
            if (activeLinkElement) {
                const navRect = navLinksRef.current.getBoundingClientRect();
                const linkRect = activeLinkElement.getBoundingClientRect();

                setIndicatorStyle({
                    left: linkRect.left - navRect.left,
                    width: linkRect.width,
                    height: linkRect.height, // Dynamic height
                    opacity: 1,
                });
            } else {
                // If no active link, hide the indicator
                setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
            }
        }
    }, [location.pathname, token, user]); // Re-run when location, token, or user changes

    const getDrawerLinkStyle = (path) => ({
        textAlign: 'left',
        padding: '12px 16px',
        color: '#333333',
        border: location.pathname === path ? `1px solid ${theme.palette.primary.main}` : 'none',
        backgroundColor: location.pathname === path ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
        borderRadius: '9999px',
        margin: '4px 8px',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
        },
    });

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Box
                sx={{
                    my: 2,
                    fontFamily: '"Roboto Condensed", sans-serif',
                    fontWeight: 'bold',
                    letterSpacing: '0.1em',
                    lineHeight: 1,
                    position: 'relative',
                    display: 'inline-block',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    fontSize: isHoveringPulseAI ? '1.75rem' : '2.1rem',
                }}
                onMouseEnter={() => setIsHoveringPulseAI(true)}
                onMouseLeave={() => setIsHoveringPulseAI(false)}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontFamily: '"Roboto Condensed", sans-serif',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em',
                        lineHeight: 1,
                        fontSize: 'inherit',
                    }}
                >
                    PulseAI
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        color: 'rgba(0, 0, 0, 0.7)',
                        fontSize: '0.8rem',
                        fontWeight: 'normal',
                        marginTop: '-5px',
                    }}
                >
                    Punjab Unified Life Safety & Emergency AI
                </Typography>
            </Box>
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/home" sx={getDrawerLinkStyle('/home')}>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>
                {token ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard" sx={getDrawerLinkStyle('/dashboard')}>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>
                        {user && user.role === 'admin' && (
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/admin" sx={getDrawerLinkStyle('/admin')}>
                                    <ListItemText primary="Admin" />
                                </ListItemButton>
                            </ListItem>
                        )}
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/emergency" sx={getDrawerLinkStyle('/emergency')}>
                                <ListItemText primary="Emergency" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/games" sx={getDrawerLinkStyle('/games')}>
                                <ListItemText primary="Games" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/drills" sx={getDrawerLinkStyle('/drills')}>
                                <ListItemText primary="Virtual Drills" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/leaderboard" sx={getDrawerLinkStyle('/leaderboard')}>
                                <ListItemText primary="Leaderboard" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/disaster-analysis" sx={getDrawerLinkStyle('/disaster-analysis')}>
                                <ListItemText primary="Disaster Analysis" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/profile" sx={getDrawerLinkStyle('/profile')}>
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout} sx={{...getDrawerLinkStyle('/logout'), border: 'none' } }>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/login" sx={getDrawerLinkStyle('/login')}>
                                <ListItemText primary="Login" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/signup" sx={getDrawerLinkStyle('/signup')}>
                                <ListItemText primary="Signup" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <AppBar position="static">
            <Toolbar sx={{ alignItems: 'center' }}>
                <Box
                    component={Link}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'inherit',
                        position: 'relative',
                        display: 'inline-block',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        fontSize: isHoveringPulseAI ? '1.75rem' : '2.1rem',
                    }}
                    onMouseEnter={() => setIsHoveringPulseAI(true)}
                    onMouseLeave={() => setIsHoveringPulseAI(false)}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: '"Roboto Condensed", sans-serif',
                            fontWeight: 'bold',
                            letterSpacing: '0.1em',
                            lineHeight: 1,
                            fontSize: 'inherit',
                            color: theme.palette.secondary.main,
                        }}
                    >
                        PulseAI
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            color: '#FFFFFF',
                            fontSize: '0.8rem',
                            fontWeight: 'normal',
                            marginTop: '-5px',
                        }}
                    >
                        Punjab Unified Life Safety & Emergency AI
                    </Typography>
                </Box>
                {isMobile ? (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ ml: 2, color: '#FFFFFF' }}
                    >
                        <MenuIcon />
                    </IconButton>
                ) : (
                    <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }} ref={navLinksRef}>
                        {/* Moving Indicator Box */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                height: '36px', // Approximate height of the button
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Light background for the capsule
                                borderRadius: '9999px', // Capsule shape
                                transition: 'all 0.3s ease-in-out',
                                left: indicatorStyle.left,
                                width: indicatorStyle.width,
                                opacity: indicatorStyle.opacity,
                                zIndex: 0, // Behind the text
                            }}
                        />
                        <Button color="inherit" component={Link} to="/home" sx={getLinkStyle('/home')}>Home</Button>
                        {token ? (
                            <>
                                <Button color="inherit" component={Link} to="/dashboard" sx={getLinkStyle('/dashboard')}>Dashboard</Button>
                                {user && user.role === 'admin' && (
                                    <Button color="inherit" component={Link} to="/admin" sx={getLinkStyle('/admin')}>Admin</Button>
                                )}
                                <Button color="inherit" component={Link} to="/emergency" sx={getLinkStyle('/emergency')}>Emergency</Button>
                                <Button color="inherit" component={Link} to="/games" sx={getLinkStyle('/games')}>Games</Button>
                                <Button color="inherit" component={Link} to="/drills" sx={getLinkStyle('/drills')}>Virtual Drills</Button>
                                <Button color="inherit" component={Link} to="/leaderboard" sx={getLinkStyle('/leaderboard')}>Leaderboard</Button>
                                <Button color="inherit" component={Link} to="/disaster-analysis" sx={getLinkStyle('/disaster-analysis')}>Disaster Analysis</Button>
                                <Button color="inherit" component={Link} to="/profile" sx={getLinkStyle('/profile')}>Profile</Button>
                                <Button color="inherit" onClick={handleLogout} sx={{ ...getLinkStyle('/logout'), border: 'none' }}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login" sx={getLinkStyle('/login')}>Login</Button>
                                <Button color="inherit" component={Link} to="/signup" sx={getLinkStyle('/signup')}>Signup</Button>
                            </>
                        )}
                    </Box>
                )}
            </Toolbar>
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: 240,
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </AppBar>
    );
};

export default Navbar;
