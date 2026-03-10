import React from "react";
import { Avatar, AvatarGroup, Badge, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

export const UserPresenceAvatar = () => {
    const riders = [
        { name: "Rahul", color: "#3B82F6" },
        { name: "Suresh", color: "#8B5CF6" },
        { name: "Amit", color: "#EC4899" },
        { name: "Priya", color: "#10B981" },
    ];

    return (
        <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <div className="flex -space-x-2">
                <AnimatePresence>
                    {riders.map((rider, index) => (
                        <motion.div
                            key={rider.name}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Tooltip title={`${rider.name} is online`}>
                                <StyledBadge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                >
                                    <Avatar
                                        sx={{
                                            width: 28,
                                            height: 28,
                                            fontSize: '0.75rem',
                                            bgcolor: rider.color,
                                            border: '2px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        {rider.name[0]}
                                    </Avatar>
                                </StyledBadge>
                            </Tooltip>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-blue-500 uppercase leading-none">4 Active</span>
                <span className="text-[8px] text-gray-400 font-medium uppercase tracking-tighter">Riders online</span>
            </div>
        </div>
    );
};
