import { SavedQueriesList, FilterLiveSearch, FilterList, FilterListItem } from 'react-admin';
import { Card, CardContent } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const AdminFilterSidebar = () => (
    <Card sx={{ order: -1, mr: 2, mt: 6, width: 350 }}>
        <CardContent>
            <SavedQueriesList />
            <FilterLiveSearch />
            <FilterList label="User ID" icon = {<PersonIcon />} >
                {/* Assuming userIds are numbered 1-10 for example purposes */}
                {Array.from({ length: 10 }, (_, i) => (
                    <FilterListItem key={i + 1} label={`User ${i + 1}`} value={{ userId: i + 1 }} />
                ))}
            </FilterList>
            <FilterList label="Completion Status" icon={<CheckCircleIcon />}>
                <FilterListItem label="Completed" value={{ completed: true }} />
                <FilterListItem label="Not Completed" value={{ completed: false }} />
            </FilterList>
        </CardContent>
    </Card>
);
