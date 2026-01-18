'use client'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, formatDuration } from "@/lib/utils";
import { FileText, Plus } from "lucide-react";
import EmptyState from "./empty-state";
import { useState } from "react";
import ItemForm from "./item-form";
import { useLearning } from "@/context/learning-context";

interface Props {
  categories: any[];
}

const ItemsView = ({ categories }: Props) => {
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  const { items, deleteItem } = useLearning()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Learning items</h2>
        <Button variant={'gradient'} onClick={() => setIsModalOpened(true)}><Plus size={20} /> New Item</Button>
      </div>

      {!isModalOpened ?
        <div className="grid gap-4">
          {items.length === 0 ? <EmptyState icon={FileText} message="Start logging your journey!" /> : items.map((log: any) => {
            const cat = categories.find((c: any) => c.id === log.categoryId);
            return (
              <Card key={log.id} className="hover:border-purple-200 transition group">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm" style={{ backgroundColor: cat?.color + '20' }}>
                      {cat?.icon === 'code' ? '💻' : '📝'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {cat && <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: cat.color + '30', color: cat.color }}>{cat.name}</span>}
                        <span className="text-xs text-gray-400">{formatDate(log.logDate)}</span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800">{log.title}</h3>
                      {log.description && <p className="text-gray-500 mt-1 text-sm">{log.description}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-mono text-sm font-medium bg-gray-100 px-3 py-1 rounded-lg">{formatDuration(log.durationMinutes)}</span>
                    <button onClick={() => deleteItem()} className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition">Delete</button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        :
        <ItemForm
          onComplete={() => { setIsModalOpened(false) }}></ItemForm>
      }

    </div >
  )
}

export default ItemsView;
