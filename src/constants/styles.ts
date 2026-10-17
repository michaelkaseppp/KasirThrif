import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        padding: 16,
    },
    headerBanner: {
        backgroundColor: '#0f172a',
        padding: 18,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#38bdf8',
        fontSize: 13,
        marginTop: 2,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    categoryText: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    priceText: {
        fontSize: 14,
        color: '#16a34a',
        fontWeight: 'bold',
        marginTop: 4,
    },
    button: {
        backgroundColor: '#2563eb',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    cartBox: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#3b82f6',
        elevation: 3,
    },
});