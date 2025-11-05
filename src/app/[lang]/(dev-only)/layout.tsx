import ProtectedLayout from "../(protected)/layout";



export default function DevOnlyLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {

    
    return <ProtectedLayout>{children}</ProtectedLayout>;
}