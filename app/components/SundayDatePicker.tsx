"use client";
import { useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { isSunday, startOfWeek, addWeeks } from 'date-fns';

export function SundayDatePicker({ valueISO, onChange }:{ valueISO: string; onChange: (iso:string)=> void }){
	const selected = useMemo(()=> new Date(valueISO), [valueISO]);
	function handleSelect(d?: Date){
		if (!d) return;
		if (!isSunday(d)) return; // ignore non-Sunday clicks
		const iso = d.toISOString().slice(0,10);
		onChange(iso);
	}
	const fromMonth = addWeeks(startOfWeek(new Date(), { weekStartsOn: 0 }), -24);
	const toMonth = addWeeks(startOfWeek(new Date(), { weekStartsOn: 0 }), 24);
	return (
		<div className="rdp-theme">
			<DayPicker
				mode="single"
				selected={selected}
				onSelect={handleSelect}
				fromMonth={fromMonth}
				toMonth={toMonth}
				modifiers={{ sunday: (d)=> isSunday(d) }}
				modifiersClassNames={{ sunday: 'rdp-sunday' }}
				disableNavigation={false}
				showOutsideDays
			/>
			<style jsx>{`
				.rdp-theme :global(.rdp) { --rdp-cell-size: 38px; --rdp-accent-color: #22c55e; --rdp-background-color: transparent; }
				.rdp-theme :global(.rdp-day) { border-radius: 8px; }
				.rdp-theme :global(.rdp-day:not(.rdp-day_selected):not(.rdp-day_outside)) { color: inherit; }
				.rdp-theme :global(.rdp-sunday:not(.rdp-day_selected)) { border: 1px dashed rgba(34,197,94,0.4); }
			`}</style>
		</div>
	);
} 