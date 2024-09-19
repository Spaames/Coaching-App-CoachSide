import { Box, Button, Flex, Icon, Link, Text, useDisclosure } from "@chakra-ui/react";
import { FaHome, FaInfoCircle, FaEnvelope, FaBars } from "react-icons/fa";
import { useEffect, ReactNode, ElementType, FormEvent } from "react";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { login, logout } from "@/app/redux/features/authSlice";
import {usePathname, useRouter} from "next/navigation";

export default function Navbar() {
    const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
    const firstName = useAppSelector((state) => state.auth.user.firstName);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isOpen, onToggle } = useDisclosure();
    const path = usePathname();

    useEffect(() => {
        const cachedUserString = localStorage.getItem("user");
        if (cachedUserString) {
            const user = JSON.parse(cachedUserString);
            dispatch(login(user));
        } else {
            dispatch(logout());
        }
    }, [dispatch, isAuth, path]);

    if (!isAuth) return null;

    const handleLogout = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/logout", {
                method: "GET",
            });
            if (response.status === 200) {
                localStorage.removeItem("user");
                dispatch(logout());
                router.push("/login");
            }
        } catch (error) {
            console.log("Error during logout");
        }
    };

    return (
        <Box as="nav" bg="gray.800" color="white" w={{ base: "100%", md: "180px" }} pos={{ md: "fixed" }} h={{ md: "100vh" }} p="4">
            <Flex justify="space-between" align="center" display={{ base: "flex", md: "none" }}>
                <Text fontSize="2xl" fontWeight="bold">Menu</Text>
                <Button onClick={onToggle} variant="outline" colorScheme="teal">
                    <Icon as={FaBars} />
                </Button>
            </Flex>

            {/* Sidebar Links: Visible on medium and up, toggle on small */}
            <Box display={{ base: isOpen ? "block" : "none", md: "block" }} mt={{ base: 4, md: 0 }}>
                <Text fontSize="2xl" mb="10" fontWeight="bold">Hello {firstName}!</Text>
                <Flex direction="column" as="ul">
                    <NavItem icon={FaHome} href="/home">Home</NavItem>
                    <NavItem icon={FaInfoCircle} href="/about">About</NavItem>
                    <NavItem icon={FaEnvelope} href="/contact">Contact</NavItem>
                    <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
                </Flex>
            </Box>
        </Box>
    );
}

interface NavItemProps {
    icon: ElementType;
    children: ReactNode;
    href: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, children, href }) => {
    return (
        <Link href={href} style={{ textDecoration: "none" }} _hover={{ bg: "gray.700", color: "teal.300" }}>
            <Flex align="center" p="2" borderRadius="md" mb="2">
                <Icon as={icon} mr="4" fontSize="20px" />
                <Text>{children}</Text>
            </Flex>
        </Link>
    );
};
