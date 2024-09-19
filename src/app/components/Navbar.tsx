'use client'
import { Box, Flex, Icon, Link, Text } from "@chakra-ui/react";
import { FaHome, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import {ReactNode, ElementType, useEffect} from "react"
import {usePathname} from "next/navigation";
import { useAppSelector, useAppDispatch} from "@/app/redux/hooks";
import {login, logout} from "@/app/redux/features/authSlice";

export default function Navbar() {
    const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
    const dispatch = useAppDispatch();
    const path = usePathname();
    useEffect(() => {
        const cachedUserString = localStorage.getItem("user");
        if (cachedUserString) {
            const user = JSON.parse(cachedUserString);
            dispatch(login(user));
        }
        else {
            dispatch(logout());
        }
    }, [dispatch, isAuth, path]);

    if (!isAuth) return null;


    return (
        <Box
            as="nav"
            pos="fixed"
            left="0"
            top="0"
            w="180px"
            h="100vh"
            bg="gray.800"
            color="white"
            padding="20px"
        >
            <Text fontSize="2xl" mb="10" fontWeight="bold">
                ReMuscles
            </Text>
            <Flex direction="column" as="ul">
                <NavItem icon={FaHome} href="/home">
                    Home
                </NavItem>
                <NavItem icon={FaInfoCircle} href="/about">
                    About
                </NavItem>
                <NavItem icon={FaEnvelope} href="/contact">
                    Contact
                </NavItem>
            </Flex>
        </Box>
    );
};

interface NavItemProps {
    icon : ElementType;
    children: ReactNode;
    href: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, children, href }) => {
    return (
        <Link
            href={href}
            style={{ textDecoration: "none" }}
            _hover={{ bg: "gray.700", color: "teal.300" }}
        >
            <Flex align="center" padding="10px" borderRadius="md" mb="2">
                <Icon as={icon} mr="4" fontSize="20px" />
                <Text>{children}</Text>
            </Flex>
        </Link>
    );
};