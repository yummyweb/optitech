import { Card, CardContent } from "@/components/ui/card";

// Cathay Pacific color palette
const colors = {
    primary: '#006564',    // Teal Green
    secondary: '#A88C48',  // Metallic Gold
    success: '#04605e',    // Darker Teal
    warning: '#c1b49a',    // Brighter Gold
    background: '#F5F5F5', // Light Gray
    text: '#2D2926',       // Dark Gray
    white: '#FFFFFF'
};

const FlightCard = ({ flightId }) => (
    <Card className="border-none shadow-lg" style={{ background: colors.white }}>
        <CardContent className="p-6">
            <div className="flex items-center">
                <p className="text-2xl font-semibold" style={{ color: colors.primary }}>Aircraft #{flightId}</p>
            </div>
        </CardContent>
    </Card>
);

export default FlightCard