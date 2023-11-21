'use client'; //要放在conversationList上

import axios from 'axios';
import type { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import Button from '../Button';
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import Select from '../inputs/Select';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface SearchProps {
    users: User[];
  }
 
function Search({ users }: SearchProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { handleSubmit, setValue, watch } = useForm<FieldValues>({
        defaultValues: {
          members: []
        }
        });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios.post('/api/conversations', {
          ...data,
          isGroup: true
        })
        .then(() => {
          router.refresh();
        })
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false));
    }

    const members = watch('members');

    return (
    <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Select
                disabled={isLoading}
                label="Members" 
                options={users.map((user) => ({ 
                  value: user.id, 
                  label: user.name 
                }))} 
                onChange={(value) => setValue('members', value, { 
                  shouldValidate: true 
                })} 
                value={members}
            />

            <Button disabled={isLoading} type="submit">
                Search
            </Button>
        </form>
    </>
   );
}
 
export default Search;