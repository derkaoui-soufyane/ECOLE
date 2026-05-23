<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calendrier extends Model
{
    use HasFactory;

    protected $table = 'calendrier';
    protected $fillable = ['id_enseignements', 'id_sujjets', 'id_salle', 'id_salle_diponible'];

    public function enseignant()
    {
        return $this->belongsTo(Enseignement::class, 'id_enseignements');
    }

    public function sujjet()
    {
        return $this->belongsTo(Sujjet::class, 'id_sujjets');
    }

    public function salle()
    {
        return $this->belongsTo(Salle::class, 'id_salle');
    }

    public function salleDisponible()
    {
        return $this->belongsTo(salle_diponible::class, 'id_salle_diponible');
    }
}