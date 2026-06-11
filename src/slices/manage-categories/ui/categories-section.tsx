import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { addCategory, removeCategory, updateCategory } from "../mutations";
import { useCategories } from "../queries";

interface CategoryNameInputProps {
	initialName?: string;
	onCancel: () => void;
	onSubmit: (name: string) => void;
}

function CategoryNameInput({
	initialName = "",
	onCancel,
	onSubmit,
}: CategoryNameInputProps) {
	const [name, setName] = useState(initialName);

	const commit = (): void => {
		const trimmed = name.trim();
		if (!trimmed) {
			return;
		}
		onSubmit(trimmed);
	};

	return (
		<>
			<input
				className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/50"
				onChange={(e) => setName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						commit();
					}
					if (e.key === "Escape") {
						onCancel();
					}
				}}
				placeholder="Category name"
				value={name}
			/>
			<button
				aria-label="Save"
				className="text-accent"
				onClick={commit}
				type="button"
			>
				<Check className="h-4 w-4" />
			</button>
			<button
				aria-label="Cancel"
				className="text-muted"
				onClick={onCancel}
				type="button"
			>
				<X className="h-4 w-4" />
			</button>
		</>
	);
}

export function CategoriesSection() {
	const categories = useCategories();
	const [editingId, setEditingId] = useState<string | null>(null);
	const [adding, setAdding] = useState(false);

	if (!categories) {
		return null;
	}

	const handleUpdate = (id: string, name: string): void => {
		updateCategory(id, name);
		setEditingId(null);
	};

	const handleAdd = (name: string): void => {
		addCategory(name);
		setAdding(false);
	};

	return (
		<section className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<h2 className="font-medium text-muted text-xs uppercase tracking-widest">
					Categories
				</h2>
				<button
					className="flex items-center gap-1 py-1 font-medium text-accent text-xs uppercase tracking-widest underline-offset-4 hover:underline"
					onClick={() => setAdding(true)}
					type="button"
				>
					<Plus className="h-3 w-3" />
					Add
				</button>
			</div>

			<div className="flex flex-col divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
				{categories.map((cat) => (
					<div className="flex items-center gap-3 px-4 py-3" key={cat.id}>
						{editingId === cat.id ? (
							<CategoryNameInput
								initialName={cat.name}
								onCancel={() => setEditingId(null)}
								onSubmit={(name) => handleUpdate(cat.id, name)}
							/>
						) : (
							<>
								<span className="flex-1 text-sm">{cat.name}</span>
								<button
									aria-label={`Edit ${cat.name}`}
									className="p-1 text-muted transition-colors hover:text-text"
									onClick={() => setEditingId(cat.id)}
									type="button"
								>
									<Pencil className="h-3.5 w-3.5" />
								</button>
								<button
									aria-label={`Delete ${cat.name}`}
									className="p-1 text-muted transition-colors hover:text-red-500"
									onClick={() => removeCategory(cat.id)}
									type="button"
								>
									<Trash2 className="h-3.5 w-3.5" />
								</button>
							</>
						)}
					</div>
				))}

				{adding && (
					<div className="flex items-center gap-3 px-4 py-3">
						<CategoryNameInput
							onCancel={() => setAdding(false)}
							onSubmit={handleAdd}
						/>
					</div>
				)}

				{categories.length === 0 && !adding && (
					<p className="px-4 py-8 text-center text-muted text-sm">
						No categories
					</p>
				)}
			</div>
		</section>
	);
}
