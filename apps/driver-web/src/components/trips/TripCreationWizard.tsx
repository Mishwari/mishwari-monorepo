import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { operatorApi, fleetApi } from '@mishwari/api';
import type { RouteDetectionResult, WaypointDetectionResult } from '@mishwari/api';
import type { Bus, Driver } from '@mishwari/types';
import type { AppState } from '@/store/store';
import { useCanPublishTrip } from '@/hooks/useCanPublishTrip';
import Step1BasicInfo from './wizard/Step1BasicInfo';
import Step2RouteSelection from './wizard/Step2RouteSelection';
import Step3WaypointSelection from './wizard/Step3WaypointSelection';
import Step4Review from './wizard/Step4Review';
import WizardProgress from './wizard/WizardProgress';

interface TripCreationWizardProps {
  onSuccess: (tripId: number) => void;
}

export default function TripCreationWizard({ onSuccess }: TripCreationWizardProps) {
  const { profile } = useSelector((state: AppState) => state.auth);
  const role = (profile as any)?.profile?.role || profile?.role;
  const isStandalone = role === 'standalone_driver';
  const [step, setStep] = useState(1);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [formData, setFormData] = useState({
    bus: 0,
    from_city_id: 0,
    to_city_id: 0,
    journey_date: '',
    planned_departure: '',
    departure_window_start: '',
    departure_window_end: '',
    total_price: 0,
    trip_type: 'scheduled' as const,
  });
  const [sessionId, setSessionId] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [selectedWaypoints, setSelectedWaypoints] = useState<number[]>([]);
  const [customPrices, setCustomPrices] = useState<Record<number, number>>({});
  
  const [routesData, setRoutesData] = useState<RouteDetectionResult | null>(null);
  const [routesLoading, setRoutesLoading] = useState(false);
  
  const [waypointsData, setWaypointsData] = useState<WaypointDetectionResult | null>(null);
  const [waypointsLoading, setWaypointsLoading] = useState(false);
  
  const [creating, setCreating] = useState(false);

  const selectedBus = buses.find(b => b.id === formData.bus);
  const selectedDriver = drivers.find(d => d.id === formData.driver);
  const { canPublish, message } = useCanPublishTrip(selectedBus, selectedDriver, isStandalone);
  
  const showBanner = step === 4;

  useEffect(() => {
    Promise.all([
      fleetApi.list().catch(() => []),
      fleetApi.getDrivers().catch(() => [])
    ]).then(([b, d]) => {
      setBuses(b);
      setDrivers(d);
    });
  }, []);

  useEffect(() => {
    if (step === 2 && formData.from_city_id > 0 && formData.to_city_id > 0) {
      setRoutesLoading(true);
      operatorApi.detectRoutes(formData.from_city_id, formData.to_city_id)
        .then(data => {
          setRoutesData(data);
          setSessionId(data.session_id);
        })
        .catch(err => alert('فشل تحميل المسارات'))
        .finally(() => setRoutesLoading(false));
    }
  }, [step, formData.from_city_id, formData.to_city_id]);

  useEffect(() => {
    if (step === 3 && sessionId && selectedRoute !== null) {
      setWaypointsLoading(true);
      operatorApi.detectWaypoints(sessionId, selectedRoute)
        .then(data => {
          setWaypointsData(data);
          setSelectedWaypoints(data.waypoints.map(w => w.city_id));
        })
        .catch(err => alert('فشل تحميل نقاط التوقف'))
        .finally(() => setWaypointsLoading(false));
    }
  }, [step, sessionId, selectedRoute]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const trip = await operatorApi.createTripWithStops({
        session_id: sessionId,
        route_index: selectedRoute!,
        ...formData,
        selected_waypoints: selectedWaypoints,
        custom_prices: customPrices,
        auto_publish: canPublish
      });
      onSuccess(trip.id);
    } catch (error: any) {
      alert(error?.response?.data?.error || 'فشل إنشاء الرحلة');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      {!canPublish && message && showBanner && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800">
            💡 {message} - يمكنك حفظ الرحلة كمسودة ونشرها لاحقاً بعد التوثيق.
          </p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <WizardProgress currentStep={step} totalSteps={4} />

        {step === 1 && (
          <Step1BasicInfo
            data={formData}
            onChange={setFormData}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2RouteSelection
            routes={routesData?.routes || []}
            loading={routesLoading}
            selected={selectedRoute}
            onSelect={setSelectedRoute}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <Step3WaypointSelection
            waypoints={waypointsData?.waypoints || []}
            totalDistance={waypointsData?.total_distance_km || 0}
            totalPrice={formData.total_price}
            loading={waypointsLoading}
            selected={selectedWaypoints}
            customPrices={customPrices}
            onChange={setSelectedWaypoints}
            onPriceChange={(cityId, price) => setCustomPrices(prev => ({ ...prev, [cityId]: price }))}
            onResetPrices={() => setCustomPrices({})}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <Step4Review
            formData={formData}
            routeSummary={waypointsData?.route_summary}
            waypoints={selectedWaypoints}
            onBack={() => setStep(3)}
            onCreate={handleCreate}
            loading={creating}
            canPublish={canPublish}
          />
        )}
      </div>
    </div>
  );
}
