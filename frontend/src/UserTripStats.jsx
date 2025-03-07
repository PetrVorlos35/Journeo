import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';
import Loading from "./Loading";

const UserTripStats = ({ userId }) => {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return; // Pokud userId není k dispozici, neprováděj fetch

        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token"); 
                const response = await fetch(`${import.meta.env.VITE_API_URL}/tripStats?id=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching trip stats:", error);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [userId]);

    if (!userId || loading) return <Loading />;

    return (
<div className="p-6 bg-white dark:bg-gray-900">
    {stats?.tripCount === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">{t("noTripsFound")}</p>
    ) : (
        <>
            <p className="text-sm md:text-lg dark:text-white text-center sm:text-left">
                <strong>{t("totalDistance")}:</strong> {stats.totalDistance}
            </p>
            <p className="text-sm md:text-lg dark:text-white text-center sm:text-left">
                <strong>{t("totalTime")}:</strong> {stats.totalTime}
            </p>
            <p className="text-sm md:text-lg dark:text-white text-center sm:text-left">
                <strong>{t("averageDistancePerTrip")}:</strong> {stats.avgDistancePerTrip}
            </p>
            <p className="text-sm md:text-lg dark:text-white text-center sm:text-left">
                <strong>{t("longestTrip")}:</strong> {stats.longestTrip.distance} km ({stats.longestTrip.duration})
            </p>
            <p className="text-sm md:text-lg dark:text-white text-center sm:text-left">
                <strong>{t("shortestTrip")}:</strong> {stats.shortestTrip.distance} km ({stats.shortestTrip.duration})
            </p>
            <p className="text-sm md:text-lg dark:text-white text-center sm:text-left">
                <strong>{t("totalTrips")}:</strong> {stats.tripCount}
            </p>
        </>
    )}
</div>

    );
};
UserTripStats.propTypes = {
    userId: PropTypes.number.isRequired,
};

export default UserTripStats;
