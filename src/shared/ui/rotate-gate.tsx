import { RotateCcw } from "lucide-react";

// Блокирует ландшафт на тач-устройствах: манифест orientation:portrait
// работает только в установленном PWA на Android, iOS его игнорирует.
// Чистый CSS — pointer-coarse отсекает десктоп, landscape ловит поворот.
export function RotateGate() {
	return (
		<div className="fixed inset-0 z-50 hidden flex-col items-center justify-center gap-4 bg-bg px-8 text-center pointer-coarse:landscape:flex">
			<RotateCcw className="h-12 w-12 text-accent" />
			<p className="font-bold font-display text-xl uppercase tracking-tight">
				Поверните устройство
			</p>
			<p className="text-muted text-sm">
				Приложение работает только в вертикальной ориентации
			</p>
		</div>
	);
}
