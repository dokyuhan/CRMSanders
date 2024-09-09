import { useGetList, useGetOne } from 'react-admin';
import { useState } from 'react';
import { TextField, NumberField, DateField } from 'react-admin';

export const DonacionesPorUsuario = ({ usuarioId }) => {
    const [selectedDonationId, setSelectedDonationId] = useState(null);

    const { data: listData, loading: listLoading, error: listError } = useGetList(
        'donations',
        {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'fecha_donacion', order: 'DESC' },
            filter: { usuario_id: usuarioId }
        }
    );

    const { data: detailData, loading: detailLoading, error: detailError } = useGetOne(
        'donations',
        selectedDonationId,
        { enabled: !!selectedDonationId } // Ensure fetch only occurs when an ID is present
    );

    if (listLoading) return <div>Loading donations list...</div>;
    if (listError) return <div>Error loading donations: {listError.message}</div>;
    if (!listData || listData.length === 0) return <div>No donations found for this user.</div>;

    return (
        <div>
            <ul>
                {listData.map((donacion) => (
                    <li key={donacion?.id} onClick={() => donacion?.id && setSelectedDonationId(donacion.id)}>
                        <NumberField source="monto" record={donacion} />
                        <TextField source="metodo_pago" record={donacion} />
                        <DateField source="fecha_donacion" record={donacion} options={{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }} />
                    </li>
                ))}
            </ul>
            {selectedDonationId && detailData && (
                <div>
                    {detailLoading ? <div>Loading donation details...</div> :
                     detailError ? <div>Error loading details: {detailError.message}</div> :
                     <div>
                        <h2>Donation Details</h2>
                        <TextField source="usuario_id" record={detailData} />
                        <NumberField source="monto" record={detailData} />
                        <TextField source="metodo_pago" record={detailData} />
                        <DateField source="fecha_donacion" record={detailData} options={{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }} />
                    </div>
                    }
                </div>
            )}
        </div>
    );
};
